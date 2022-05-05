import { ChangeEventHandler, useCallback } from 'react'
import { BsLightningCharge, BsLightningChargeFill } from 'react-icons/bs'
import {
  Divider,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Switch
} from '@chakra-ui/react'

import { MQTT_TOPICS } from '@constants/topics'
import { useDevices } from '@contexts/Devices'

interface OutputSwitchProps {
  device: Device
}

const ariaLabel = ['brightness']
const defaultValues = [0]

export const OutputSwitch = ({ device }: OutputSwitchProps) => {
  const { updateDevice, publishMessages } = useDevices()

  const handleOutputState = useCallback(
    (state: number): Device => {
      const updatedDevice = {
        mac: device.mac,
        outputState: state
      }

      return updatedDevice as Device
    },
    [device.mac]
  )

  const handlePublish = useCallback(
    (updatedDevice: Device) => {
      updateDevice(updatedDevice as Device)
      publishMessages(
        ('/fse2021/180122258/dispositivos/' + device.mac) as MQTT_TOPICS.DEVICE,
        JSON.stringify({
          state: updatedDevice.outputState
        })
      )
    },
    [device.mac, updateDevice, publishMessages]
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const updatedDevice = handleOutputState(event.target.checked ? 1 : 0)
      handlePublish(updatedDevice)
    },
    [handleOutputState, handlePublish]
  )

  const handleRangeChange = useCallback(
    (value: number[]) => {
      const updatedDevice = handleOutputState(value[0])
      handlePublish(updatedDevice)
    },
    [handleOutputState, handlePublish]
  )

  if (device.battery) return null

  return (
    <>
      <Divider backgroundColor="whiteAlpha.100" />

      <Grid
        templateColumns="auto auto 1fr"
        templateRows="auto"
        columnGap={3}
        rowGap={1}
      >
        <GridItem gridColumn="1" gridRow="1">
          <FormLabel
            htmlFor="output"
            mb="0"
            mx="0"
            color="white"
            textTransform="capitalize"
          >
            {device.outputName}
          </FormLabel>
        </GridItem>

        {device?.dimmable ? (
          <GridItem gridColumn="1/-1" gridRow="2">
            <RangeSlider
              onChangeEnd={handleRangeChange}
              defaultValue={defaultValues}
              aria-label={ariaLabel}
            >
              <RangeSliderTrack bg="whiteAlpha.400">
                <RangeSliderFilledTrack bg="cyan.500" />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={5} index={0} />
            </RangeSlider>
          </GridItem>
        ) : (
          <GridItem gridColumn="2" gridRow="1">
            <Switch
              id="output"
              isChecked={!!device.outputState}
              onChange={handleChange}
              size="lg"
              colorScheme="teal"
            />
          </GridItem>
        )}

        <GridItem gridColumn="3" gridRow="1" justifySelf="right">
          <Icon
            as={device.outputState ? BsLightningChargeFill : BsLightningCharge}
            color={device.outputState ? 'cyan' : 'whiteAlpha.600'}
            w={21}
            h={21}
          />
        </GridItem>
      </Grid>
    </>
  )
}
