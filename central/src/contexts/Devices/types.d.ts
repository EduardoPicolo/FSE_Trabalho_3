type MessageHandlerArgs = {
  topic: string
  payload: DistributedEvent | RegisterEvent | ReRegisterEvent
}

type MessageHandler = ({ topic, payload }: MessageHandlerArgs) => void
