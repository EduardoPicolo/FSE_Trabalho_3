import { ChangeEventHandler, useCallback } from 'react'
import { BsLightningCharge, BsLightningChargeFill } from 'react-icons/bs'
import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Switch
} from '@chakra-ui/react'

import { MQTT_TOPICS } from '@constants/topics'
import { useDevices } from '@contexts/Devices'

interface OutputSwitchProps {
  device: Device
}

export const OutputSwitch = ({ device }: OutputSwitchProps) => {
  const { updateDevice, publishMessages } = useDevices()

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const updatedDevice = { ...device, state: event.target.checked ? 1 : 0 }
      updateDevice(updatedDevice)

      publishMessages(
        ('/fse2021/180122258/dipositivos/' + device.mac) as MQTT_TOPICS.DEVICE,
        JSON.stringify({ mode: 'update', state: updatedDevice.state })
      )
    },
    [device, publishMessages, updateDevice]
  )
  if (device.battery) return null

  return (
    <>
      <Divider backgroundColor="whiteAlpha.900" />

      <Flex alignItems="center">
        <FormControl display="flex" alignItems="center">
          <FormLabel
            htmlFor="output"
            mb="0"
            color="white"
            textTransform="capitalize"
          >
            {device.outputName}
          </FormLabel>
          <Switch
            id="output"
            isChecked={!!device.state}
            onChange={handleChange}
            size="lg"
            colorScheme="teal"
          />
        </FormControl>

        <Icon
          as={device.state ? BsLightningChargeFill : BsLightningCharge}
          color={device.state ? 'cyan' : 'whiteAlpha.600'}
          w={21}
          h={21}
        />
      </Flex>
    </>
  )
}
