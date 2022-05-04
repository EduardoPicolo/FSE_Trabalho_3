import { BsDropletHalf, BsThermometerHalf } from 'react-icons/bs'
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react'

interface DHTProps {
  device: Device
}

export const DHT = ({ device }: DHTProps) => {
  return (
    <>
      <Tooltip
        hasArrow
        label={`Temperature`}
        placement="bottom"
        closeOnClick={false}
        bg="whiteAlpha.800"
        color="black"
        openDelay={250}
      >
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
      </Tooltip>

      <Tooltip
        hasArrow
        label={`Humidity`}
        placement="bottom"
        closeOnClick={false}
        bg="whiteAlpha.800"
        color="black"
        openDelay={250}
      >
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
      </Tooltip>
    </>
  )
}
