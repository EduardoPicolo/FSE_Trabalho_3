import { useEffect, useRef } from 'react'
import MQTT, { connect } from 'mqtt'

interface useMqttProps {
  uri: string
  options?: MQTT.IClientOptions
  topicHandlers?: { topic: string; handler: (payload: any) => void }[]
  onConnectedHandler?: (client: MQTT.MqttClient) => void
}

export function useMqtt({
  uri,
  options = {},
  topicHandlers = [{ topic: '', handler: ({ topic, payload, packet }) => {} }],
  onConnectedHandler = (client) => {}
}: useMqttProps) {
  const clientRef = useRef(null)

  useEffect(() => {
    if (clientRef.current) return

    if (!topicHandlers || topicHandlers.length === 0) return () => {}

    try {
      clientRef.current = options ? connect(uri) : connect(uri)
      clientRef.current.publish('/esp/test', 'CONECTEI POUHA 22')
    } catch (error) {
      console.error('error', error)
    }

    const client = clientRef.current
    topicHandlers.forEach((th) => {
      client?.subscribe(th.topic)
    })
    client?.on('message', (topic, rawPayload, packet) => {
      const th = topicHandlers.find((t) => t.topic === topic)
      let payload

      try {
        payload = JSON.parse(rawPayload)
      } catch {
        payload = rawPayload
      }

      if (th) th.handler({ topic, payload, packet })
    })

    client?.on('connect', () => {
      if (onConnectedHandler) onConnectedHandler(client)
      client?.publish('/esp/test', 'CONECTEI POUHA')
    })

    return () => {
      if (client) {
        topicHandlers.forEach((th) => {
          client.unsubscribe(th.topic)
        })
        client.end()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (clientRef.current) {
      setTimeout(() => {
        if (clientRef.current) {
          console.log('TESTE!')
          clientRef.current.publish('/esp/test', 'CONECTEI POUHA 55555')
        }
      }, 5000)
    }
  }, [clientRef])

  clientRef?.current?.publish?.('/esp/test', 'CONECTEI POUHA FORA 1')
}
