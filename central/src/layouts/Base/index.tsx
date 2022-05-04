import { useEffect } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'

import { formatDate } from '@utils/formatDate'

import * as S from './styles'

type BaseLayoutProps = {
  children?: React.ReactNode
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  useEffect(() => {
    document.getElementsByTagName('video')[0].playbackRate = 0.6
  }, [])

  return (
    <Box minHeight="100vh" padding={['2', '4', '8', '10']}>
      <S.Video autoPlay playsInline muted loop poster="/img/background.png">
        {/* <source src="/video/graph.webm" type="video/webm" />
        <source src="/video/graph.mp4" type="video/mp4" />
        Your browser does not support the video tag. */}
      </S.Video>

      <VStack margin="0 auto" width={['90%', '75%']} maxWidth="1440px">
        <Flex justifyContent="space-between" width="100%" px={2} mb={-2}>
          <Text fontSize="xs" color="gray.200" fontWeight="light">
            // Servidor Central
          </Text>
          <Text
            fontSize="xs"
            color="gray.200"
            fontWeight="light"
            alignSelf="flex-end"
          >
            {formatDate(new Date(), 'long', 'pt-BR')}
          </Text>
        </Flex>

        <S.Main>{children}</S.Main>

        <Text
          fontSize="xs"
          color="gray.200"
          fontWeight="light"
          paddingRight="1.5"
          alignSelf="flex-end"
        >
          // Fundamentos de Sistemas Embarcados - Trabalho 2
        </Text>
      </VStack>
    </Box>
  )
}
