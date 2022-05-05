#include "esp_system.h"
#include "esp_log.h"
#include "json_util.h"

static const char *TAG = "JSON_UTIL";

cJSON *json_util_register(int battery_){
    cJSON *data = cJSON_CreateObject();
    if(data == NULL) ESP_LOGE(TAG, "json_register failed");

    cJSON *mode = NULL;
    mode = cJSON_CreateString("register");
    if(mode == NULL) ESP_LOGE(TAG, "json_register failed");
    cJSON_AddItemToObject(data, "mode", mode);

    cJSON *battery = NULL;
    battery = cJSON_CreateNumber(battery_);
    if(battery == NULL) ESP_LOGE(TAG, "json_register failed");
    cJSON_AddItemToObject(data, "battery", battery);

    return data;
}

cJSON *json_util_unregister(void){
    cJSON *data = cJSON_CreateObject();
    if(data == NULL) ESP_LOGE(TAG, "json_unregister failed");

    cJSON *mode = NULL;
    mode = cJSON_CreateString("unregister");
    if(mode == NULL) ESP_LOGE(TAG, "json_unregister failed");
    cJSON_AddItemToObject(data, "mode", mode);

    return data;
}

cJSON *json_util_re_register(nvs_data_s nvs_data){
    cJSON *data = cJSON_CreateObject();
    if(data == NULL) ESP_LOGE(TAG, "json_re_register failed");

    cJSON *mode = NULL;
    mode = cJSON_CreateString("re-register");
    if(mode == NULL) ESP_LOGE(TAG, "json_re_register failed");
    cJSON_AddItemToObject(data, "mode", mode);

    cJSON *room = NULL;
    room = cJSON_CreateString(nvs_data.room);
    if(room == NULL) ESP_LOGE(TAG, "json_re_register failed");
    cJSON_AddItemToObject(data, "room", room);

    cJSON *input_name = NULL;
    input_name = cJSON_CreateString(nvs_data.input_name);
    if(input_name == NULL) ESP_LOGE(TAG, "json_re_register failed");
    cJSON_AddItemToObject(data, "inputName", input_name);

    cJSON *output_name = NULL;
    output_name = cJSON_CreateString(nvs_data.output_name);
    if(output_name == NULL) ESP_LOGE(TAG, "json_re_register failed");
    cJSON_AddItemToObject(data, "outputName", output_name);

    cJSON *alarm = NULL;
    alarm = cJSON_CreateBool(nvs_data.alarm);
    if(alarm == NULL) ESP_LOGE(TAG, "json_re_register failed");
    cJSON_AddItemToObject(data, "alarm", alarm);

    return data;
}

cJSON *json_util_pub(const char *value_name_, int value_){
    cJSON *data = cJSON_CreateObject();
    if(data == NULL) ESP_LOGE(TAG, "json_util_pub failed");

    uint8_t mac[6];
    esp_read_mac(mac, ESP_MAC_WIFI_STA);

    char mac_str[18];
    sprintf(mac_str, MACSTR, MAC2STR(mac));

    cJSON *mac_address = NULL;
    mac_address = cJSON_CreateString(mac_str);
    if(mac_address == NULL) ESP_LOGE(TAG, "json_util_pub failed");
    cJSON_AddItemToObject(data, "mac", mac_address);

    cJSON *value = NULL;
    value = cJSON_CreateNumber(value_);
    if(value == NULL) ESP_LOGE(TAG, "json_util_pub failed");
    cJSON_AddItemToObject(data, value_name_, value);

    return data;
}

int json_util_get_state(char *json_str){
    cJSON *json = cJSON_Parse(json_str);
    if(json == NULL) return 0;

    cJSON *state = cJSON_GetObjectItem(json, "state");
    if(state == NULL) return 0;

    return state->valueint;
}


