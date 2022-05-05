type DevicesContextType = {
  devices: Device[]
  addDevice: (device: Device) => void
  updateDevice: (device: Device) => void
  removeDevice: (device: Device) => void
  isFormOpen: boolean
  initialFormValues: Device | undefined
  publishMessages: (topic: Topics, message: string) => void
  toggleForm: (state?: boolean) => void
  currentMac: string
  logData: Log[]
  addLogEntry: (command: string, value: unknown, device: string) => void
}

type MessageHandlerArgs = {
  topic: string
  payload: RegisterEvent | ReRegisterEvent | UpdateEvent
}

type MessageHandler = ({ topic, payload }: MessageHandlerArgs) => void
