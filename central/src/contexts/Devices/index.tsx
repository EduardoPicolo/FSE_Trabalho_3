import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'

import { client, useMqttConnect } from '@hooks/useMQTTconnect'

export type DevicesContextType = {
  isFormOpen: boolean
  publishMessages: () => void
}

export const CentralServerDefaultValues: DevicesContextType = {
  isFormOpen: false,
  publishMessages: () => ({})
}

export const DevicesContext = createContext<DevicesContextType>(
  CentralServerDefaultValues
)

interface DevicesProviderProps {
  children: React.ReactNode
}

export const DevicesProvider: React.FC<DevicesProviderProps> = ({
  children
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const incommingMessageHandlers = useRef<
    {
      topic: string
      handler: MessageHandler
    }[]
  >([
    {
      topic: '/esp/test',
      handler: (msg) => {
        // addMessage(msg)
        console.log('Message received aqui: TESTE: ', msg)
      }
    },
    {
      topic: '/fse2021/180122258/dipositivos/+',
      handler: (msg) => {
        // addMessage(msg)
        console.log('Message received: register: ', msg)
        setIsFormOpen(true)
      }
    },
    {
      topic: '/fse2021/180122258/+/temperatura',
      handler: (msg) => {
        console.log('Message received: temperatura: ', msg)
      }
    },
    {
      topic: '/fse2021/180122258/+/umidade',
      handler: (msg) => {
        console.log('Message received: umidade: ', msg)
      }
    },
    {
      topic: '/fse2021/180122258/+/estado',
      handler: (msg) => {
        console.log('Message received: estado: ', msg)
      }
    }
  ])

  useMqttConnect({
    uri: 'mqtt://broker.hivemq.com:8000/mqtt',
    topicHandlers: incommingMessageHandlers.current
  })

  const publishMessages = useCallback(() => {
    if (!client) {
      console.log('(publishMessages) Cannot publish, mqttClient: ', client)

      return
    }

    client?.publish('/esp/test', '1st message from component')
  }, [])

  const value = useMemo(
    () => ({
      isFormOpen,
      publishMessages
    }),
    [isFormOpen, publishMessages]
  )

  return (
    <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
  )
}

export function useDevices() {
  const context = useContext(DevicesContext)

  if (!context) {
    throw new Error('useDevices must be used within a DevicesProvider')
  }

  return context
}
