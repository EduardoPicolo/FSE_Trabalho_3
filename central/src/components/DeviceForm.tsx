import { Progress } from '@chakra-ui/react'
import { Modal } from 'Modal'

interface DeviceFormProps {
  initialValues: Device
}

export const DeviceForm = ({ initialData, isOpen }: DeviceFormProps) => {
  return (
    <Modal title="Register new device" isOpen={isOpen} onClose={() => {}}>
      <Progress size="xs" colorScheme="purple" isIndeterminate />
    </Modal>
  )
}
