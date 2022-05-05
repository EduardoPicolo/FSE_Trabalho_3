import { CSVLink } from 'react-csv'
import { Button } from '@chakra-ui/react'

import { useDevices } from '@contexts/Devices'

export const CSVDownload = () => {
  const { logData } = useDevices()

  return (
    <Button colorScheme="purple" variant="solid">
      <CSVLink data={logData} filename="log.csv">
        Download CSV
      </CSVLink>
    </Button>
  )
}
