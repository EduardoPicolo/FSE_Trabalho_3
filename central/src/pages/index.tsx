import type { NextPage } from 'next'

import { DeviceForm } from '@components/DeviceForm'

import { useMQTT } from '../hooks/useMQTT'

const Home: NextPage = () => {
  useMQTT()

  return <DeviceForm isOpen={true} />
}

export default Home
