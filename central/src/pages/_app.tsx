import type { AppProps } from 'next/app'
import Head from 'next/head'
import NextNprogress from 'nextjs-progressbar'
import { toast } from 'react-toastify'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPageWithLayout } from 'types/next-page'

import { DevicesProvider } from '@contexts/Devices'
import { BaseLayout } from '@layouts/Base'

import { theme } from '@styles/theme'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const nextNprogressOptions = {
  showSpinner: false
}

toast.configure({
  autoClose: 2500,
  position: 'top-right',
  theme: 'dark'
})

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>)

  return (
    <>
      <Head>
        <title>FSE Trabalho 2</title>
      </Head>

      <ChakraProvider theme={theme} resetCSS>
        <DevicesProvider>
          <NextNprogress
            color="linear-gradient(
              to right,
              #00c3ff,
              #b169f3
              )"
            startPosition={0.4}
            stopDelayMs={200}
            height={4}
            options={nextNprogressOptions}
            showOnShallow={false}
          />
          {getLayout(<Component {...pageProps} />)}
        </DevicesProvider>
      </ChakraProvider>
    </>
  )
}

export default App
