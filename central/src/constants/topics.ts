export const enum MQTT_TOPICS {
  DEVICE = '/fse2021/180122258/dipositivos/+',
  TEMPERATURE = '/fse2021/180122258/+/temperatura',
  HUMIDITY = '/fse2021/180122258/+/umidade',
  STATE = '/fse2021/180122258/+/estado'
}

export type Topics = keyof Record<MQTT_TOPICS, string>
