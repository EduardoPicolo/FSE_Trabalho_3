import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'
import { toast } from 'react-toastify'

import { MQTT_TOPICS, Topics } from '@constants/topics'
import { client, useMqttConnect } from '@hooks/useMQTTconnect'

import { ACTIONS, stateReducer } from './reducer'

export const CentralServerDefaultValues: DevicesContextType = {
  devices: [],
  addDevice: () => ({}),
  updateDevice: () => ({}),
  removeDevice: () => ({}),
  isFormOpen: false,
  initialFormValues: undefined,
  publishMessages: () => ({}),
  toggleForm: () => ({}),
  currentMac: '',
  logData: [],
  addLogEntry: () => ({})
}

export const DevicesContext = createContext<DevicesContextType>(
  CentralServerDefaultValues
)

interface DevicesProviderProps {
  children: React.ReactNode
}

const logData = [] as Log[]

const setLogData = (data: Log) => {
  logData.push(data)
}

export const DevicesProvider: React.FC<DevicesProviderProps> = ({
  children
}) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [initialFormValues, setInitialValues] = useState<Device | undefined>(
    undefined
  )
  const [currentMac, setCurrentMac] = useState<string>('')

  const addLogEntry = useCallback(
    (command: string, value: unknown, device: string) => {
      setLogData({
        command,
        value,
        esp: device,
        time: new Date().toLocaleString()
      })
    },
    []
  )

  const [devices, dispatchEvent] = useReducer(stateReducer, [
    // {
    //   battery: true,
    //   inputName: 'inputName',
    //   outputName: 'outputName',
    //   mac: '49',
    //   room: 'sala49',
    //   inputState: 0,
    //   outputState: 0,
    //   alarm: true
    // },
    // {
    //   battery: false,
    //   inputName: 'inputName',
    //   outputName: 'outputName',
    //   mac: '50',
    //   room: 'sala50',
    //   inputState: 0,
    //   outputState: 0,
    //   alarm: false,
    //   dimmable: true
    // },
    // {
    //   battery: false,
    //   inputName: 'inputName',
    //   outputName: 'outputName',
    //   mac: '51',
    //   room: 'sala50',
    //   inputState: 0,
    //   outputState: 0,
    //   alarm: true,
    //   dimmable: false
    // }
  ] as Device[])

  const addDevice = useCallback((device: Device) => {
    dispatchEvent({
      type: ACTIONS.ADD_DEVICE,
      payload: device
    })
    setInitialValues(undefined)
    setCurrentMac('')
  }, [])

  const removeDevice = useCallback(
    (device: Device) => {
      dispatchEvent({
        type: ACTIONS.REMOVE_DEVICE,
        payload: device
      })
      addLogEntry('UNREGISTER', '', device.mac)
    },
    [addLogEntry]
  )

  const updateDevice = useCallback(
    (device: Device) => {
      dispatchEvent({
        type: ACTIONS.UPDATE_DEVICE,
        payload: device
      })
      addLogEntry('UPDATE OUTPUT', device.outputState, device.mac)
    },
    [addLogEntry]
  )

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
      topic: MQTT_TOPICS.DEVICE,
      handler: (msg) => {
        console.log('Message received: dispositivo: ', msg)
        const mode = msg.payload.mode
        const mac = msg.topic.split('/')[4]

        // if (mode === 'unregister') {
        //   dispatchEvent({
        //     type: ACTIONS.REMOVE_DEVICE,
        //     payload: {
        //       mac
        //     }
        //   })

        //   return
        // }

        switch (mode) {
          case 'unregister':
            dispatchEvent({
              type: ACTIONS.REMOVE_DEVICE,
              payload: {
                mac
              }
            })
            break
          case 'register': {
            toast.info(`ESP ${mac} Detected`)
            setIsFormOpen(true)
            setCurrentMac(mac)
            break
          }
          case 're-register': {
            // @ts-expect-error Ignore harmless error
            delete msg.payload.mode
            dispatchEvent({
              type: ACTIONS.ADD_DEVICE,
              payload: {
                ...msg.payload,
                inputState: 0,
                outputState: 0,
                mac
              } as Device
            })
            // setInitialValues({ ...msg.payload, inputState: 0, mac } as Device)
            break
          }
          default:
            break
        }

        if (mode !== 'register' && mode !== 're-register') return

        addLogEntry('DEVICE', mode, mac)

        // toast.info(`ESP ${mac} Detected`)
        // setIsFormOpen(true)
        // setCurrentMac(mac)

        // // @ts-expect-error Ignore harmless error
        // delete msg.payload.mode
        // setInitialValues({ ...msg.payload, inputState: 0, mac } as Device)
      }
    },
    {
      topic: MQTT_TOPICS.TEMPERATURE,
      handler: (msg) => {
        console.log('Message received: temperatura: ', msg)
        dispatchEvent({
          type: ACTIONS.UPDATE_DEVICE,
          payload: {
            // @ts-expect-error Ignore harmless error
            mac: msg.payload.mac,
            // @ts-expect-error Ignore harmless error
            temperature: msg.payload.temperature
          }
        })
        // @ts-expect-error Ignore harmless error
        addLogEntry('TEMPERATURE', msg.payload.temperature, msg.payload.mac)
      }
    },
    {
      topic: MQTT_TOPICS.HUMIDITY,
      handler: (msg) => {
        console.log('Message received: umidade: ', msg)
        dispatchEvent({
          type: ACTIONS.UPDATE_DEVICE,
          payload: {
            // @ts-expect-error Ignore harmless error
            mac: msg.payload.mac,
            // @ts-expect-error Ignore harmless error
            humidity: msg.payload.humidity
          }
        })
        // @ts-expect-error Ignore harmless error
        addLogEntry('HUMIDITY', msg.payload.humidity, msg.payload.mac)
      }
    },
    {
      topic: MQTT_TOPICS.STATE,
      handler: (msg) => {
        console.log('Message received: estado: ', msg)
        // if (msg.payload.mode !== 'update') return

        // @ts-expect-error Ignore harmless error
        const mac = msg.payload.mac

        dispatchEvent({
          type: ACTIONS.UPDATE_DEVICE,
          // @ts-expect-error Ignore harmless error
          payload: { mac, inputState: msg.payload.state }
        })

        // @ts-expect-error Ignore harmless error
        addLogEntry('STATE', msg.payload.state, mac)
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
      currentMac,
      logData,
      addLogEntry
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
      updateDevice,
      addLogEntry
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
