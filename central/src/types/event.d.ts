interface Device {
  mac: string
  room: string
  battery: boolean
  inputName: string
  outputName?: string
}

type DistributedEvent = {
  mode: 'register' | 're-register'
}

interface RegisterEvent extends DistributedEvent {
  mode: 'register'
  battery: boolean
}

interface ReRegisterEvent extends DistributedEvent {
  mode: 're-register'
  battery: boolean
  room: string
  inputName: string
  outputName?: string
}
