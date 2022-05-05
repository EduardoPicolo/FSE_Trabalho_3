#ifndef NVS_UTIL_H_
#define NVS_UTIL_H_


typedef struct {
    uint8_t is_registered;
    char room[32];
    char input_name[32];
    char output_name[32];
    uint8_t alarm;
} nvs_data_s;

void nvs_util_setup(void);
void nvs_util_register_setup();
nvs_data_s nvs_util_get_data(void);
void nvs_util_set_data(char *string);
void nvs_util_clear_data(void);
char * nvs_util_get_mac_topic();


#endif /* NVS_UTIL_H_ */
