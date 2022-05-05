import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack
} from '@chakra-ui/react'
import { Modal } from 'Modal'

import { MQTT_TOPICS } from '@constants/topics'
import { useDevices } from '@contexts/Devices'

type FormValues = {
  room: string
  inputName: string
  outputName?: string
  state?: number
}

export const DeviceForm = () => {
  const {
    isFormOpen,
    publishMessages,
    addDevice,
    toggleForm,
    currentMac,
    initialFormValues
  } = useDevices()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger
  } = useForm<FormValues>({
    defaultValues: useMemo(() => initialFormValues, [initialFormValues])
  })

  useEffect(() => {
    reset(initialFormValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFormValues])

  const onSubmit = useCallback(
    (data: FormValues) => {
      console.log(data)
      publishMessages(
        ('/fse2021/180122258/dipositivos/' + currentMac) as MQTT_TOPICS.DEVICE,
        JSON.stringify({ ...data, state: 0 })
      )
      addDevice({
        inputState: 0,
        outputState: 0,
        battery: false,
        ...data,
        mac: currentMac
      })
      toggleForm(false)
      reset()
    },
    [addDevice, currentMac, publishMessages, reset, toggleForm]
  )

  return (
    <Modal
      title="Register a new device"
      isOpen={isFormOpen}
      onClose={() => {}}
      closeOnOverlayClick={false}
      onOverlayClick={trigger}
      size="md"
      isCentered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Object.keys(errors).length > 0} isRequired>
          <Stack spacing={4}>
            <Box>
              <FormLabel htmlFor="room" margin={0}>
                Room
              </FormLabel>
              <Input
                id="room"
                placeholder="Room"
                {...register('room', {
                  required: 'This is required',
                  minLength: { value: 3, message: 'Minimum length should be 3' }
                })}
                variant="flushed"
                isInvalid={!!errors?.room}
                autoComplete="off"
              />
              <FormErrorMessage>
                {errors?.room && errors.room.message}
              </FormErrorMessage>
            </Box>

            <Box>
              <FormLabel htmlFor="inputName" margin={0}>
                Device name
              </FormLabel>
              <Input
                id="inputName"
                placeholder="Input Device Name"
                {...register('inputName', {
                  required: 'This is required',
                  minLength: { value: 3, message: 'Minimum length should be 3' }
                })}
                variant="flushed"
                isInvalid={!!errors?.inputName}
                disabled={!!initialFormValues?.inputName}
                autoComplete="off"
              />
              <FormErrorMessage>
                {errors?.inputName && errors.inputName.message}
              </FormErrorMessage>
            </Box>

            {!initialFormValues?.battery && (
              <Box>
                <FormLabel htmlFor="outputName" margin={0}>
                  Device name
                </FormLabel>
                <Input
                  id="outputName"
                  placeholder="Output Device Name"
                  {...register('outputName', {
                    required: 'This is required',
                    minLength: {
                      value: 3,
                      message: 'Minimum length should be 3'
                    }
                  })}
                  variant="flushed"
                  isInvalid={!!errors?.outputName}
                  disabled={!!initialFormValues?.outputName}
                  autoComplete="off"
                />
                <FormErrorMessage>
                  {errors?.outputName && errors.outputName.message}
                </FormErrorMessage>
              </Box>
            )}
          </Stack>
        </FormControl>

        <Button
          mt={8}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          size="lg"
          isFullWidth
        >
          Submit
        </Button>
      </form>
    </Modal>
  )
}
