import { BsDropletHalf, BsThermometerHalf } from 'react-icons/bs'
import { Flex, Icon, Text } from '@chakra-ui/react'

interface DHTProps {
  device: Device
}

export const DHT = ({ device }: DHTProps) => {
  return (
    <>
      <Flex alignItems="center" marginLeft={-1}>
        <Icon
          as={BsThermometerHalf}
          w={21}
          h={21}
          color="cyan.500"
          marginTop={-1}
        />
        <Text as="span" color="white" fontSize="medium" fontWeight="medium">
          36°C
        </Text>
      </Flex>

      <Flex alignItems="center">
        <Icon
          as={BsDropletHalf}
          w={21}
          h={21}
          color="cyan.500"
          marginTop={-1}
        />
        <Text as="span" color="white" fontSize="medium" fontWeight="medium">
          36%
        </Text>
      </Flex>
    </>
  )
}
