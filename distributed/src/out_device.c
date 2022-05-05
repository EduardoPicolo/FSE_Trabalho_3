#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/ledc.h"
#include "driver/gpio.h"

#include "esp_log.h"

#include "out_device.h"


xQueueHandle out_device_queue;

static const char *TAG = "OUT_DEVICE";

void out_device_start(void * params){
    int value;
    int pin = (int) params;
    while(true){
        if(xQueueReceive(out_device_queue, &value, portMAX_DELAY)){
            ESP_LOGI(TAG, "Pin %d is %d", pin, value);
            gpio_set_level(pin, value);
        }
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void out_device_setup(int pin){

    gpio_pad_select_gpio(pin);
    gpio_set_direction(pin, GPIO_MODE_OUTPUT);

    out_device_queue = xQueueCreate(5, sizeof(int));
    xTaskCreate(&out_device_start, "wifi_start", 4096, (void*)pin, 1, NULL);
}

void out_device_set_state(int value){
    xQueueSend(out_device_queue, &value, portMAX_DELAY);
}
