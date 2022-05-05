#ifndef JSON_UTIL_H_
#define JSON_UTIL_H_


#include "cJSON.h"
#include "nvs_util.h"


cJSON *json_util_register(int battery_);
cJSON *json_util_unregister(void);
cJSON *json_util_re_register(nvs_data_s nvs_data);
cJSON *json_util_pub(const char *value_name_, int value_);
int json_util_get_state(char *json_str);


#endif /* JSON_UTIL_H_ */
