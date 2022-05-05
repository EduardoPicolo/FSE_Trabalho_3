#include "esp_system.h"
#include "esp_log.h"

#include "nvs_util.h"
#include "mqtt.h"
#include "util.h"
#include "json_util.h"

void unregister_esp(void){
    uint8_t mac[6];
    esp_read_mac(mac, ESP_MAC_WIFI_STA);
    char mac_str[18];
    sprintf(mac_str, MACSTR, MAC2STR(mac));
    char register_topic[64];
    sprintf(register_topic, "%s/dispositivos/%s", CONFIG_ESP_MQTT_BASE_TOPIC, mac_str);
    mqtt_pub(register_topic, cJSON_Print(json_util_unregister()));
}
