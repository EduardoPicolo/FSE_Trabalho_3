import { SunIcon } from '@chakra-ui/icons'
import {
  Badge,
  Flex,
  Grid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip
} from '@chakra-ui/react'

import { DHT } from './DHT'
import { OutputSwitch } from './OutputSwitch'

interface DeviceProps {
  device: Device
}

export const Device = ({ device }: DeviceProps) => {
  return (
    <Grid templateRows="auto 1fr">
      <Text fontSize="md" textTransform="capitalize" color="white">
        // {device.room}
      </Text>
      <Flex
        flexDirection="column"
        height="100%"
        gap={2}
        border="1px solid"
        borderColor="whiteAlpha.900"
        padding={3}
      >
        <Stat>
          <StatLabel>
            <Tooltip
              hasArrow
              label={`MAC Address`}
              placement="right"
              closeOnClick={false}
              bg="whiteAlpha.800"
              color="black"
              openDelay={250}
            >
              <Badge variant="outline" colorScheme="cyan">
                {device.mac}
              </Badge>
            </Tooltip>
          </StatLabel>
          <StatNumber>
            <Flex
              alignItems="center"
              gap={2}
              color="white"
              textTransform="capitalize"
            >
              {device.inputName}
              {
                {
                  true: <SunIcon color="cyan.500" />,
                  false: <SunIcon color="whiteAlpha.600" />
                }[Boolean(device.state)?.toString?.()]
              }
              <Text
                as="span"
                fontSize="xs"
                fontWeight="light"
                color={device.state ? 'cyan' : 'whiteAlpha.600'}
              >
                {device.state ? 'ON' : 'OFF'}
              </Text>
            </Flex>
          </StatNumber>
          <StatHelpText display="flex" gap={2}>
            <DHT device={device} />
          </StatHelpText>
        </Stat>

        <OutputSwitch device={device} />
      </Flex>
    </Grid>
  )
}
