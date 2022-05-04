interface Device {
  mac: string
  room: string
  battery: boolean
  inputName: string
  inputState: number
  outputName?: string
  outputState?: number
}

type DistributedEvent = {
  mode: 'register' | 're-register'
  battery: boolean
}

interface RegisterEvent extends DistributedEvent {
  mode: 'register'
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
