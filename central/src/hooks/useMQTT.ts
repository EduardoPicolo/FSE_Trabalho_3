import { useEffect, useState } from 'react'
import { connect, MqttClient } from 'mqtt'

let client: MqttClient | null = null
const mqtt_url = 'mqtt://broker.hivemq.com:8000/mqtt'
const connect_options = {
  clientId: 'next_heat_' + Math.random().toString(16).substr(2, 8)
}
const subscribe_options = { qos: 2 }
const publish_options = { qos: 2, retain: false }

export const useMQTT = () => {
  const [mqtt, setMqtt] = useState('nothing')
  const [checked_mqtt, setCheckedMqtt] = useState(false)

  useEffect(() => {
    const isMounted = true

    if (client == null) {
      client = connect(mqtt_url)
      client.on('connect', () => {
        console.log('connected')
        client?.publish('/esp/test', 'CONECTEI POUHA')
        client?.subscribe('/esp/test')
        // client.subscribe(
        //   Object.entries(rooms).map(([key, room]) => room.heater.topic),
        //   subscribe_options
        // );
        // client.subscribe(
        //   Object.entries(rooms).map(([key, room]) => room.ambient.topic),
        //   subscribe_options
        // );
        // client.subscribe(
        //   Object.entries(rooms).map(([key, room]) => room.metal.topic),
        //   subscribe_options
        // );
        if (!isMounted) return
        setMqtt('connected')
        setCheckedMqtt(true)
      })

      client.on('reconnect', () => {
        console.log('reconnecting')
        if (!isMounted) return
        setMqtt('reconnecting')
        setCheckedMqtt(false)
      })

      client.on('error', (err) => {
        console.log(err)
        client?.end()
        client = null
      })

      client.on('close', () => {
        console.log('closed and component unmounted so no state update')
      })

      client.on('message', (topic, msg) => {
        if (!isMounted) return
        const data = msg.toString()

        // const data = JSON.parse(msg);
        if (data === undefined) {
          console.log(`undefined msg : '${data}'`)
        } else {
          //   receive_data(topic, data);
          console.log('message received: ' + msg.toString(), topic)
        }
      })
    } else {
      console.log('client already initialized')
    }

    return () => {
      client?.end()
      client = null
    }
  }, [])
}
