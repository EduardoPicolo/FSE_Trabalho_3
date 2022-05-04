import type { NextPage } from 'next'

import { DeviceForm } from '@components/DeviceForm'

const Home: NextPage = () => {
  //   useMqttConnect()

  return <DeviceForm isOpen={true} />
}

export default Home
