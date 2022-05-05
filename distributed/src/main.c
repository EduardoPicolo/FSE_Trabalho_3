#include "hal/gpio_types.h"

#include "nvs_util.h"
#include "connection.h"
#include "dht.h"
#include "in_device.h"
#include "out_device.h"


#define DHT_PIN         GPIO_NUM_4
#define OUT_DEVICE_PIN  GPIO_NUM_2
#define IN_DEVICE_PIN   GPIO_NUM_0

void app_main(void){

    nvs_util_setup();
    connection_setup();
    dht_setup(DHT_PIN);
    in_device_setup(IN_DEVICE_PIN);
    out_device_setup(OUT_DEVICE_PIN);

}
