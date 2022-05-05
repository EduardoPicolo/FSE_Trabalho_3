import { Grid, Heading, Progress } from '@chakra-ui/react'

import { Device } from '@components/Device'
import { useDevices } from '@contexts/Devices'

export const DevicesList = () => {
  const { devices } = useDevices()

  if (!devices || devices.length === 0) {
    return (
      <>
        <Heading size="lg" color="white" mb={2}>
          Waiting for connections...
        </Heading>
        <Progress size="xs" isIndeterminate colorScheme="cyan" />
      </>
    )
  }

  return (
    <Grid
      templateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}
      gap={6}
      autoFlow="row dense"
    >
      {devices.map((device) => (
        <Device key={device.mac} device={device} />
      ))}
    </Grid>
  )
}
