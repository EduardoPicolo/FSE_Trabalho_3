interface Device {
  mac: string
  room: string
  input_name: string
  output_name: string
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
  room: string
  input_name: string
  output_name: string
}
