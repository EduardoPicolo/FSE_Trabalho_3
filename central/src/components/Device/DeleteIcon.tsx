import { useCallback } from 'react'
import { DeleteIcon as Icon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/react'

import { MQTT_TOPICS } from '@constants/topics'
import { useDevices } from '@contexts/Devices'

interface DeleteIconProps {
  device: Device
}

export const DeleteIcon = ({ device }: DeleteIconProps) => {
  const { publishMessages } = useDevices()

  const handleClick = useCallback(() => {
    publishMessages(
      ('/fse2021/180122258/dipositivos/' + device.mac) as MQTT_TOPICS.DEVICE,
      JSON.stringify({ mode: 'unregister' })
    )
  }, [device.mac, publishMessages])

  return (
    <Tooltip
      label={`Double click to remove`}
      placement="right"
      closeOnClick={false}
      bg="red.300"
      color="black"
      openDelay={250}
    >
      <Icon
        color="red.700"
        w={4}
        h={4}
        cursor="pointer"
        onDoubleClick={handleClick}
      />
    </Tooltip>
  )
}
