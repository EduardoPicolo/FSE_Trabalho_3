#include <nvs_component.h>
#include <stdlib.h>
#include <string.h>

#include "esp_system.h"
#include "esp_log.h"
#include "esp_err.h"
#include "mqtt.h"
#include "nvs_util.h"
#include "json_util.h"


static nvs_data_s *nvs_data = NULL;
static const char *TAG = "NVS";

void nvs_util_reset_data(void){
    nvs_data->is_registered = false;
    nvs_data->room[0] = '\0';
    nvs_data->input_name[0] = '\0';
    nvs_data->output_name[0] = '\0';
    nvs_data->alarm = 0;
    nvs_data->battery = 0;
}

void nvs_util_setup(void){
    ESP_ERROR_CHECK(nvs_init());

    nvs_data = malloc(sizeof(nvs_data_s));
    nvs_util_reset_data();
}

void nvs_util_register_setup(void){
    read_struct("nvs_data", &nvs_data, sizeof(nvs_data_s));

    uint8_t mac[6];
    esp_read_mac(mac, ESP_MAC_WIFI_STA);

    char mac_str[18];
    sprintf(mac_str, MACSTR, MAC2STR(mac));
    char register_topic[64];
    sprintf(register_topic, "%s/dispositivos/%s", CONFIG_ESP_MQTT_BASE_TOPIC, mac_str);

    if(!nvs_data->is_registered){

        cJSON *pub_json = NULL;
        pub_json = json_util_register(false);

        mqtt_pub(register_topic, cJSON_Print(pub_json));

        char msg[128];
        mqtt_sub(register_topic, msg);
    }else{
        mqtt_pub(register_topic, cJSON_Print(json_util_re_register(*nvs_data)));
    }
}

nvs_data_s nvs_util_get_data(void){
    return *nvs_data;
}

void nvs_util_set_data(char *string){
    ESP_LOGI(TAG, "nvs_util_set_data: %s", string);

    cJSON *json = cJSON_Parse(string);
    if(json == NULL) return;

    cJSON *mode = cJSON_GetObjectItem(json, "mode");
    if(mode == NULL) return;

    if(strcmp(mode->valuestring, "register-esp") == 0){

        cJSON *room = cJSON_GetObjectItem(json, "room");
        if(room == NULL) return;

        cJSON *input_name = cJSON_GetObjectItem(json, "inputName");
        if(input_name == NULL) return;

        cJSON *output_name = cJSON_GetObjectItem(json, "outputName");
        if(output_name == NULL) return;

        cJSON *battery = cJSON_GetObjectItem(json, "battery");
        if(battery == NULL) return;

        cJSON *alarm = cJSON_GetObjectItem(json, "alarm");
        if(alarm == NULL) return;

        nvs_data->is_registered = true;
        strcpy(nvs_data->room, room->valuestring);
        strcpy(nvs_data->input_name, input_name->valuestring);
        strcpy(nvs_data->output_name, output_name->valuestring);
        nvs_data->alarm = alarm->valueint;
        nvs_data->battery = battery->valueint;
    }

    write_struct("nvs_data", nvs_data, sizeof(nvs_data_s));
    cJSON_Delete(json);
}

void nvs_util_clear_data(void){
    nvs_util_reset_data();
    write_struct("nvs_data", nvs_data, sizeof(nvs_data_s));
    read_struct("nvs_data", &nvs_data, sizeof(nvs_data_s));
    ESP_LOGI(TAG, "nvs_util_clear_data: %s", nvs_data->room);
}
