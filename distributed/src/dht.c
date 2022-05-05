#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"

#include "dht11.h"
#include "dht.h"
#include "mqtt.h"
#include "nvs_util.h"
#include "json_util.h"


const int DHT_HUMIDITY_KEY = 0;
const int DHT_TEMPERATURE_KEY = 1;
static const char *TAG = "DHT";


void mqtt_pub_dht(int payload, int key){
    char topic[128];
    cJSON *pub_json = NULL;

    if(!nvs_util_get_data().is_registered) return;

    if(key == DHT_TEMPERATURE_KEY){
        pub_json = json_util_pub("temperature", payload);
        sprintf(topic, "%s/%s/%s", CONFIG_ESP_MQTT_BASE_TOPIC, nvs_util_get_data().room, "temperatura");
    }else{
        pub_json = json_util_pub("humidity", payload);
        sprintf(topic, "%s/%s/%s", CONFIG_ESP_MQTT_BASE_TOPIC, nvs_util_get_data().room, "umidade");
    }

    if(pub_json == NULL) return;

    mqtt_pub(topic, cJSON_Print(pub_json));
    cJSON_Delete(pub_json);
}

void taskReadDht11(void *key){
    struct dht11_reading dht11_data;
    int avg = 0;
    int last = 0;
    int count = 0;

    while(true){
        if(++count == 5) count = 0;

        vTaskDelay(2000 / portTICK_PERIOD_MS);
        dht11_data = DHT11_read();

        if((int)key == DHT_TEMPERATURE_KEY){
            if(dht11_data.status == DHT11_OK){
                avg = (last + dht11_data.temperature) / 2;
                last = dht11_data.temperature;
            }
            ESP_LOGI(TAG, "temperature: %d", dht11_data.temperature);
            if(!count) mqtt_pub_dht(avg, (int)key);
        }else{
            if(dht11_data.status == DHT11_OK){
                avg = (last + dht11_data.humidity) / 2;
                last = dht11_data.humidity;
            }
            ESP_LOGI(TAG, "humidity: %d", dht11_data.humidity);
            if(!count) mqtt_pub_dht(avg, (int)key);
        }
    }
}

void dht_setup(int pin){
    DHT11_init(pin);
    xTaskCreate(&taskReadDht11, "taskReadTemperature", 4096, (void *)DHT_TEMPERATURE_KEY, 1, NULL);
    xTaskCreate(&taskReadDht11, "taskReadHumidity", 4096, (void *)DHT_HUMIDITY_KEY, 1, NULL);
}
