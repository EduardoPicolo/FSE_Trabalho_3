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
  updateDevice: (device: Device) => void
  removeDevice: (device: Device) => void
  isFormOpen: boolean
  initialFormValues: Device | undefined
  publishMessages: (topic: Topics, message: string) => void
  toggleForm: (state?: boolean) => void
  currentMac: string
}

export const CentralServerDefaultValues: DevicesContextType = {
  devices: [],
  addDevice: () => ({}),
  updateDevice: () => ({}),
  removeDevice: () => ({}),
  isFormOpen: false,
  initialFormValues: undefined,
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
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [initialFormValues, setInitialValues] = useState<Device | undefined>(
    undefined
  )

  const [currentMac, setCurrentMac] = useState<string>('')

  const [devices, dispatchEvent] = useReducer(stateReducer, [
    {
      battery: false,
      inputName: 'teste40',
      outputName: 'teste40',
      mac: '400000040000004000000400000040000004000000',
      room: 'sala40',
      state: 0
    },
    {
      battery: true,
      inputName: 'teste43',
      mac: '4333333',
      room: 'sala43',
      state: 255
    }
  ] as Device[])
  console.log('DevicesProvider: ', devices)

  const addDevice = useCallback((device: Device) => {
    dispatchEvent({
      type: ACTIONS.ADD_DEVICE,
      payload: device
    })
    setInitialValues(undefined)
    setCurrentMac('')
  }, [])

  const removeDevice = useCallback((device: Device) => {
    dispatchEvent({
      type: ACTIONS.REMOVE_DEVICE,
      payload: device
    })
  }, [])

  const updateDevice = useCallback((device: Device) => {
    dispatchEvent({
      type: ACTIONS.UPDATE_DEVICE,
      payload: device
    })
  }, [])

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
      topic: MQTT_TOPICS.DEVICE,
      handler: (msg) => {
        console.log('Message received: dispositivo: ', msg)
        const mode = msg.payload.mode

        if (mode !== 'register' && mode !== 're-register') return
        const mac = msg.topic.split('/')[4]
        setIsFormOpen(true)
        setCurrentMac(mac)
        // @ts-expect-error Ignore harmless error
        delete msg.payload.mode
        setInitialValues({ ...msg.payload, inputState: 0, mac } as Device)
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
        if (msg.payload.mode !== 'update') return
        console.log('UPDATE DEVICE', msg.payload.state)
        dispatchEvent({
          type: ACTIONS.UPDATE_DEVICE,
          payload: { mac: msg.payload.mac, inputState: msg.payload.state }
        })
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
      updateDevice,
      removeDevice,
      isFormOpen,
      initialFormValues,
      publishMessages,
      toggleForm,
      currentMac
    }),
    [
      addDevice,
      currentMac,
      devices,
      initialFormValues,
      isFormOpen,
      publishMessages,
      removeDevice,
      toggleForm,
      updateDevice
    ]
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
