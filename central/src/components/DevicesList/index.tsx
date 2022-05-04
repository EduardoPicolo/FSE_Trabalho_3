import { Grid } from '@chakra-ui/react'

import { Device } from '@components/Device'
import { useDevices } from '@contexts/Devices'

export const DevicesList = () => {
  const { devices } = useDevices()

  return (
    <Grid
      templateColumns={'repeat(auto-fill, minmax(200px, 1fr))'}
      gap={6}
      autoFlow="row dense"
    >
      {devices.map((device) => (
        <Device key={device.mac} device={device} />
      ))}
    </Grid>
  )
}
