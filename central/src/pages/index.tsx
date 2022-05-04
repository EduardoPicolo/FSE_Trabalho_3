import type { NextPage } from 'next'

import { DeviceForm } from '@components/DeviceForm'
import { DevicesList } from '@components/DevicesList'

const Home: NextPage = () => {
  return (
    <>
      <DevicesList />
      <DeviceForm />
    </>
  )
}

export default Home
