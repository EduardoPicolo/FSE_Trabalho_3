type MessageHandlerArgs = {
  topic: string
  payload: Event | RegisterEvent | ReRegisterEvent
}

type MessageHandler = ({ topic, payload }: MessageHandlerArgs) => void
