#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"

#include <stdio.h>
#include <string.h>
#include "esp_system.h"
#include "esp_log.h"
#include "mqtt.h"
#include "nvs_util.h"
#include "json_util.h"

#include "in_device.h"

static xQueueHandle gpio_isr_queue;
static const char *TAG = "WIFI";
static int state = 0;


void mqtt_pub_in_device(int payload){
    char topic[128];

    cJSON *pub_json = NULL;
    pub_json = json_util_pub("state", payload);
    if(pub_json == NULL) return;

    sprintf(topic, "%s/%s/%s", CONFIG_ESP_MQTT_BASE_TOPIC, nvs_util_get_data().room, "estado");
    mqtt_pub(topic, cJSON_Print(pub_json));
    cJSON_Delete(pub_json);
}

static void IRAM_ATTR gpio_isr_handler(void * args){
    int gpio_num = (int) args;
    xQueueSendFromISR(gpio_isr_queue, &gpio_num, NULL);
}

void in_device_isr(void *args){
    int pin;
    while(true){
        if(xQueueReceive(gpio_isr_queue, &pin, portMAX_DELAY)){

            int estado = gpio_get_level(pin);
            if(!estado){
                state = !state;
                gpio_isr_handler_remove(pin);
                ESP_LOGI(TAG, "Pin %d is pressed", pin);
                mqtt_pub_in_device(state);

                int count = 0;
                while(gpio_get_level(pin) == estado){
                    vTaskDelay(50 / portTICK_PERIOD_MS);
                    if(++count >= 60){
                        ESP_LOGI(TAG, "Pin %d is long pressed", pin);
                        nvs_util_clear_data();
                        // mqtt_pub(nvs_util_get_mac_topic(), cJSON_Print(json_util_unregister()));
                        fflush(stdout);
                        esp_restart();
                    }
                }

                ESP_LOGI(TAG, "Pin %d is released", pin);
                gpio_isr_handler_add(pin, gpio_isr_handler, (void *) pin);
            }
        }
    }
}

void in_device_setup(int pin){
    gpio_pad_select_gpio(pin);
    gpio_set_direction(pin, GPIO_MODE_INPUT);

    gpio_pulldown_en(pin);
    gpio_pullup_dis(pin);
    gpio_set_intr_type(pin, GPIO_INTR_ANYEDGE);

    gpio_isr_queue = xQueueCreate(10, sizeof(int));
    xTaskCreate(in_device_isr, "in_device_isr", 4096, NULL, 1, NULL);

    gpio_install_isr_service(0);
    gpio_isr_handler_add(pin, gpio_isr_handler, (void *) pin);
}
