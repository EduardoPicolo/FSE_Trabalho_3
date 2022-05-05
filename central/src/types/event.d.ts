interface Device {
  mac: string
  room: string
  battery: boolean
  temperature?: number
  humidity?: number
  inputName: string
  inputState: number
  outputName?: string
  outputState?: number
  alarm?: boolean
  dimmable?: boolean
}

type DistributedEvent = {
  mode: 'register' | 're-register' | 'unregister'
  battery: boolean
  temperature?: number
  humidity?: number
}

interface RegisterEvent extends DistributedEvent {
  mode: 'register' | 'unregister'
}

interface ReRegisterEvent extends DistributedEvent {
  mode: 're-register'
  room: string
  inputName: string
  outputName?: string
}

interface UpdateEvent {
  mode: 'update'
  mac: string
  state: number
}

interface Log {
  command: string
  value: unknown
  esp: string
  time: string
}
