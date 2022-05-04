type MessageHandlerArgs = {
  topic: string
  payload: RegisterEvent | ReRegisterEvent | UpdateEvent
}

type MessageHandler = ({ topic, payload }: MessageHandlerArgs) => void
