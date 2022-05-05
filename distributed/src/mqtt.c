#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_system.h"
#include "esp_event.h"
#include "esp_netif.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/event_groups.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"
#include "mqtt_client.h"

#include "nvs_util.h"
#include "json_util.h"
#include "out_device.h"
#include "mqtt.h"


#define MQTT_CONNECTED_BIT BIT0
#define MQTT_FAIL_BIT      BIT1

#define TAG "MQTT"

extern xSemaphoreHandle mqtt_semaphore;
static esp_mqtt_client_handle_t client;

void _mqtt_subscribe(char *data){
    if(!nvs_util_get_data().is_registered)
        nvs_util_set_data(data);
    else{
        cJSON *json = cJSON_Parse(data);
        cJSON *mode = NULL;
        cJSON *state = NULL;
        mode = cJSON_GetObjectItem(json, "mode");
        state = cJSON_GetObjectItem(json, "state");
        if(mode != NULL && strcmp(mode->valuestring, "unregister") == 0)
            nvs_util_clear_data();
        else if(state != NULL)
            out_device_set_state(json_util_get_state(data));
    }
}

static esp_err_t mqtt_event_handler_(esp_mqtt_event_handle_t event){
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            xSemaphoreGive(mqtt_semaphore);
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;

        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");
            printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
            printf("DATA=%.*s\r\n", event->data_len, event->data);
            event->data[event->data_len] = '\0';
            _mqtt_subscribe(event->data);
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }
    return ESP_OK;
}

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data) {
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
    mqtt_event_handler_(event_data);
}

void mqtt_setup(void){
    esp_mqtt_client_config_t mqtt_config = {
        .uri = "mqtt://broker.hivemq.com",
    };
    client = esp_mqtt_client_init(&mqtt_config);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    esp_mqtt_client_start(client);
}

void mqtt_pub(char * topic, char * msg){
    int message_id = esp_mqtt_client_publish(client, topic, msg, 0, 1, 0);
    ESP_LOGI(TAG, "pub message: %d on topic: %s", message_id, topic);
}

void mqtt_sub(char * topic){
    int message_id = esp_mqtt_client_subscribe(client, topic, 0);
    ESP_LOGI(TAG, "sub message: %d on topic: %s", message_id, topic);
}

void mqtt_unsub(char * topic){
    int message_id = esp_mqtt_client_unsubscribe(client, topic);
    ESP_LOGI(TAG, "unsub message: %d on topic: %s", message_id, topic);
}