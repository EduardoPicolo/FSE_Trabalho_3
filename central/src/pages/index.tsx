import { useCallback } from 'react'
import type { NextPage } from 'next'
import { toast } from 'react-toastify'
import { Text } from '@chakra-ui/react'

import { DeviceForm } from '@components/DeviceForm'
import { DevicesList } from '@components/DevicesList'
import { MacBadge } from '@components/MacBadge'
import { Modal } from '@components/Modal'
import { useDevices } from '@contexts/Devices'

const Home: NextPage = () => {
  const { isFormOpen, currentMac } = useDevices()

  const handleOutsideClick = useCallback(() => {
    toast.warning('You must register this device', {
      toastId: 'outside-click',
      autoClose: false,
      position: 'top-center'
    })
  }, [])

  const ModalHeader = useCallback(
    () => (
      <>
        <Text>Register a new Device</Text>
        <MacBadge mac={currentMac} />
      </>
    ),
    [currentMac]
  )

  return (
    <>
      <DevicesList />
      <Modal
        title={<ModalHeader />}
        isOpen={isFormOpen}
        onClose={() => {}}
        closeOnOverlayClick={false}
        onOverlayClick={handleOutsideClick}
        size="md"
        isCentered
      >
        <DeviceForm />
      </Modal>
    </>
  )
}

export default Home
