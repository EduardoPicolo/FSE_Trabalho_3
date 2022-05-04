interface Device {
  mac: string
  room: string
  battery: boolean
  input_name: string
  output_name?: string
}

type Event = {
  mode: 'register' | 're-register'
}

interface RegisterEvent extends Event {
  mode: 'register'
  battery: boolean
}

interface ReRegisterEvent extends Event {
  mode: 're-register'
  battery: boolean
  room: string
  input_name: string
  output_name?: string
}
