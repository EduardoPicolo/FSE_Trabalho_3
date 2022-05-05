#include <stdio.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "freertos/semphr.h"

#include "wifi.h"
#include "mqtt.h"
#include "nvs_util.h"

xSemaphoreHandle wifi_semaphore;
xSemaphoreHandle mqtt_semaphore;

const char *TAG = "CONNECTION";

void wifi_start(void * params){
    while(true){
        if(xSemaphoreTake(wifi_semaphore, portMAX_DELAY)){
            mqtt_setup();
        }
    }
}

void mqtt_start(void * params){
    while(true){
        if(xSemaphoreTake(mqtt_semaphore, portMAX_DELAY)){
            nvs_util_register_setup();
        }
    }
}

void connection_setup(void){
    mqtt_semaphore = xSemaphoreCreateBinary();
    wifi_semaphore = xSemaphoreCreateBinary();
    wifi_setup();

    xTaskCreate(&wifi_start, "wifi_start", 4096, NULL, 1, NULL);
    xTaskCreate(&mqtt_start, "mqtt_start", 8196, NULL, 1, NULL);
}
