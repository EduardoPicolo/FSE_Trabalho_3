#ifndef MQTT_H_
#define MQTT_H_

void mqtt_setup(void);
void mqtt_pub(char * topic, char * msg);
void mqtt_sub(char * topic);
void mqtt_unsub(char * topic);

#endif /* MQTT_H_ */
