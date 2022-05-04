import { useCallback } from 'react'
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
}

interface DeviceFormProps {
  initialValues?: Device
}

export const DeviceForm = ({ initialValues }: DeviceFormProps) => {
  const { isFormOpen, publishMessages, addDevice, toggleForm, currentMac } =
    useDevices()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger
  } = useForm<FormValues>({
    defaultValues: initialValues
  })

  const onSubmit = useCallback(
    (data: FormValues) => {
      console.log(data)
      publishMessages(
        ('/fse2021/180122258/dipositivos/' +
          currentMac) as MQTT_TOPICS.REGISTER,
        JSON.stringify(data)
      )
      addDevice({ ...data, battery: !!initialValues?.battery, mac: currentMac })
      toggleForm(false)
      reset()
    },
    [
      addDevice,
      currentMac,
      initialValues?.battery,
      publishMessages,
      reset,
      toggleForm
    ]
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
      {/* <Button onClick={() => publishMessages()}>TESTE</Button> */}
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
              />
              <FormErrorMessage>
                {errors?.inputName && errors.inputName.message}
              </FormErrorMessage>
            </Box>

            {initialValues?.battery && (
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
