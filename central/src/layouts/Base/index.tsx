import { Box, Flex, Text, VStack } from '@chakra-ui/react'

import { CSVDownload } from '@components/CSVDownload'
import { formatDate } from '@utils/formatDate'

import * as S from './styles'

type BaseLayoutProps = {
  children?: React.ReactNode
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <Box minHeight="100vh" padding={['2', '4', '8', '10']}>
      <S.Background />

      <VStack margin="0 auto" width={['90%', '70%']} maxWidth="1440px">
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

        <Flex
          justifyContent="space-between"
          width="100%"
          alignItems="flex-start"
        >
          <CSVDownload />
          <Text
            fontSize="xs"
            color="gray.200"
            fontWeight="light"
            paddingRight="1.5"
          >
            // Fundamentos de Sistemas Embarcados - Trabalho Final
          </Text>
        </Flex>
      </VStack>
    </Box>
  )
}
