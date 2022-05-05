import { useFormContext } from 'react-hook-form'
import {
  Box,
  Checkbox,
  FormErrorMessage,
  FormLabel,
  Input
} from '@chakra-ui/react'

import { FormValues } from '.'

export const OutputForm = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<FormValues & { dimmable: boolean }>()

  return (
    <>
      <Box>
        <FormLabel htmlFor="outputName" margin={0}>
          Output Device name
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
          autoComplete="off"
        />
        <FormErrorMessage>
          {errors?.outputName && errors.outputName.message}
        </FormErrorMessage>
      </Box>

      <Box>
        <Checkbox
          id="dimmable"
          {...register('dimmable', {
            required: false
          })}
          fontWeight="medium"
        >
          Dimmable
        </Checkbox>
      </Box>
    </>
  )
}
