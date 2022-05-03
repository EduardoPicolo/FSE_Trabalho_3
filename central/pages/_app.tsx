import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Connector } from 'mqtt-react-hooks';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Connector brokerUrl="mqtt://broker.hivemq.com:8000/mqtt">
      <Component {...pageProps} />
    </Connector>
  );
}

export default MyApp;
