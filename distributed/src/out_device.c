#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/ledc.h"
#include "driver/gpio.h"

#include "esp_log.h"

#include "nvs_util.h"
#include "out_device.h"


xQueueHandle out_device_queue;

static const char *TAG = "OUT_DEVICE";

void out_device_start(void * params){
    int value;
    int pin = (int) params;
    while(true){
        if(xQueueReceive(out_device_queue, &value, portMAX_DELAY)){
            if(nvs_util_get_data().dimmable){
                ESP_LOGI(TAG, "Pin dimmable %d is %d", pin, value);
                ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, value*255/100);
                ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
            }else{
                ESP_LOGI(TAG, "Pin %d is %d", pin, value);
                gpio_set_level(pin, value);
            }
        }
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void out_device_setup(int pin){

    if(nvs_util_get_data().dimmable){
        ledc_timer_config_t ledc_timer = {
            .speed_mode       = LEDC_LOW_SPEED_MODE,
            .duty_resolution  = LEDC_TIMER_8_BIT,
            .timer_num        = LEDC_TIMER_0,
            .freq_hz          = 1000,
            .clk_cfg          = LEDC_AUTO_CLK
        };
        ESP_ERROR_CHECK(ledc_timer_config(&ledc_timer));

        ledc_channel_config_t ledc_channel = {
            .gpio_num       = pin,
            .speed_mode     = LEDC_LOW_SPEED_MODE,
            .channel        = LEDC_CHANNEL_0,
            .timer_sel      = LEDC_TIMER_0,
            .duty           = 0,
            .hpoint         = 0
        };
        ESP_ERROR_CHECK(ledc_channel_config(&ledc_channel));
        ESP_LOGI(TAG, "DIMMABLE");
    }else{
        gpio_pad_select_gpio(pin);
        gpio_set_direction(pin, GPIO_MODE_OUTPUT);
        ESP_LOGI(TAG, "DIGITAL");
    }

    out_device_queue = xQueueCreate(5, sizeof(int));
    xTaskCreate(&out_device_start, "wifi_start", 4096, (void*)pin, 1, NULL);
}

void out_device_set_state(int value){
    xQueueSend(out_device_queue, &value, portMAX_DELAY);
}
