import { useEffect } from 'react'
import { Badge, Tooltip } from '@chakra-ui/react'

interface Props {
  device: Device
}

export const Alarm = ({ device }: Props) => {
  useEffect(() => {
    if (device.alarm && device.inputState) {
      console.log('PLAY SOUND')
      const audio = new Audio('/sound/alert.wav')
      audio.play()
    }
  }, [device.alarm, device.inputState])

  return (
    <Tooltip
      hasArrow
      label={`Alarm is On`}
      placement="top"
      closeOnClick={false}
      bg="whiteAlpha.800"
      color="black"
      openDelay={250}
    >
      <Badge variant="solid" colorScheme="yellow" color="black">
        Alarm
      </Badge>
    </Tooltip>
  )
}
