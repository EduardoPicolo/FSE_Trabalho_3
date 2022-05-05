import { useEffect, useState } from 'react'
import { connect, IClientOptions, MqttClient } from 'mqtt'
import MQTTPattern from 'mqtt-pattern'

export let client: MqttClient | null = null
const mqtt_url = 'mqtt://broker.hivemq.com:8000/mqtt'
const connect_options = {
  clientId: 'next_heat_' + Math.random().toString(16).substr(2, 8)
}
const subscribe_options = { qos: 2 }
const publish_options = { qos: 2, retain: false }

// const topics = {
//   register: '/fse2021/180122258/dispositivos/+',
//   temperature: '/fse2021/180122258/+/temperatura',
//   humidity: '/fse2021/180122258/+/umidade',
//   state: '/fse2021/180122258/+/estado'
// }

interface useMqttConnectProps {
  uri: string
  options?: IClientOptions
  topicHandlers?: { topic: string; handler: (payload: any) => void }[]
  onConnectedHandler?: (client: MqttClient) => void
}

export function useMqttConnect({
  uri,
  options = {},
  topicHandlers = [
    { topic: '', handler: ({ topic, payload, packet }) => ({}) }
  ],
  onConnectedHandler = (client) => ({})
}: useMqttConnectProps) {
  const [mqtt, setMqtt] = useState('nothing')
  const [checked_mqtt, setCheckedMqtt] = useState(false)

  useEffect(() => {
    if (client == null) {
      client = connect(uri || 'mqtt://broker.hivemq.com:8000/mqtt', options)
      client.on('connect', () => {
        console.log('connected')
        client?.publish('/esp/test', 'CONECTEI POUHA')

        topicHandlers.forEach((th) => {
          console.log('subscribing to: ' + th.topic)
          client?.subscribe(th.topic)
        })

        setMqtt('connected')
        setCheckedMqtt(true)
      })

      client.on('reconnect', () => {
        console.log('reconnecting')
        setMqtt('reconnecting')
        setCheckedMqtt(false)
      })

      client.on('error', (err) => {
        console.log(err)
        client?.end()
        client = null
      })

      client.on('close', () => {
        console.log('connection closed')
      })

      client?.on('message', (topic, rawPayload, packet) => {
        const th = topicHandlers.find((t) =>
          MQTTPattern.matches(t.topic, topic)
        )
        let payload

        try {
          payload = JSON.parse(rawPayload?.toString?.())
        } catch {
          console.log('error parsing payload')
          payload = rawPayload?.toString?.()
        }

        console.log('PAYLOAD RECEIVED: ', payload)
        if (th) th.handler({ topic, payload, packet })
      })
    } else {
      console.log('Client already initialized')
    }

    return () => {
      client?.end()
      client = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
