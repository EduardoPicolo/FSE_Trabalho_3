import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'

import { MQTT_TOPICS, Topics } from '@constants/topics'
import { client, useMqttConnect } from '@hooks/useMQTTconnect'

import { ACTIONS, stateReducer } from './reducer'

export type DevicesContextType = {
  devices: Device[]
  addDevice: (device: Device) => void
  isFormOpen: boolean
  publishMessages: (topic: Topics, message: string) => void
  toggleForm: (state?: boolean) => void
  currentMac: string
}

export const CentralServerDefaultValues: DevicesContextType = {
  devices: [],
  addDevice: () => ({}),
  isFormOpen: false,
  publishMessages: () => ({}),
  toggleForm: () => ({}),
  currentMac: ''
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
  const [devices, dispatchEvent] = useReducer(stateReducer, [] as Device[])
  console.log('DevicesProvider: ', devices)

  const addDevice = useCallback((device: Device) => {
    dispatchEvent({
      type: ACTIONS.ADD_DEVICE,
      payload: device
    })
  }, [])

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

  const [currentMac, setCurrentMac] = useState<string>('')

  const toggleForm = useCallback(
    (state?: boolean) =>
      setIsFormOpen(state !== undefined ? state : !isFormOpen),
    [isFormOpen]
  )

  const incommingMessageHandlers = useRef<
    {
      topic: string
      handler: MessageHandler
    }[]
  >([
    {
      topic: '/esp/test',
      handler: (msg) => {
        console.log('Message received aqui: TESTE: ', msg)
      }
    },
    {
      topic: MQTT_TOPICS.REGISTER,
      handler: (msg) => {
        console.log('Message received: register: ', msg)
        if (msg.payload.mode !== 'register') return
        setIsFormOpen(true)
        setCurrentMac(msg.topic.split('/')[4])
      }
    },
    {
      topic: MQTT_TOPICS.TEMPERATURE,
      handler: (msg) => {
        console.log('Message received: temperatura: ', msg)
      }
    },
    {
      topic: MQTT_TOPICS.HUMIDITY,
      handler: (msg) => {
        console.log('Message received: umidade: ', msg)
      }
    },
    {
      topic: MQTT_TOPICS.STATE,
      handler: (msg) => {
        console.log('Message received: estado: ', msg)
      }
    }
  ])

  useMqttConnect({
    uri: 'mqtt://broker.hivemq.com:8000/mqtt',
    topicHandlers: incommingMessageHandlers.current
  })

  const publishMessages = useCallback((topic: Topics, message: string) => {
    if (!client) {
      console.log('(publishMessages) Cannot publish, mqttClient: ', client)

      return
    }

    client?.publish(topic, message)
  }, [])

  const value = useMemo(
    () => ({
      devices,
      addDevice,
      isFormOpen,
      publishMessages,
      toggleForm,
      currentMac
    }),
    [addDevice, currentMac, devices, isFormOpen, publishMessages, toggleForm]
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
