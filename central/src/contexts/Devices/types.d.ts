type MessageHandlerArgs = {
  topic: string
  payload: RegisterEvent | ReRegisterEvent
}

type MessageHandler = ({ topic, payload }: MessageHandlerArgs) => void
