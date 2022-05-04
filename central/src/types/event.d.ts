interface Device {
  mac: string
  room: string
  battery: boolean
  inputName: string
  outputName?: string
  state: number
}

type DistributedEvent = {
  mode: 'register' | 're-register'
  battery: boolean
  state: number
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
