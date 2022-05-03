import { useEffect } from 'react';
import { connect } from 'mqtt';

let client = null;
var mqtt_url = 'ws://10.0.0.31:1884';
const connect_options = { clientId: 'next_heat_' + Math.random().toString(16).substr(2, 8) };
const subscribe_options = { qos: 2 };
const publish_options = { qos: 2, retain: false };

export const useMQTT = () => {
  useEffect(() => {
    let isMounted = true;
    if (client == null) {
      client = connect(mqtt_url, connect_options);
      client.on('connect', () => {
        console.log('connected');
        client.subscribe(
          Object.entries(rooms).map(([key, room]) => room.heater.topic),
          subscribe_options
        );
        client.subscribe(
          Object.entries(rooms).map(([key, room]) => room.ambient.topic),
          subscribe_options
        );
        client.subscribe(
          Object.entries(rooms).map(([key, room]) => room.metal.topic),
          subscribe_options
        );
        if (!isMounted) return;
        setMqtt('connected');
        setCheckedMqtt(true);
      });
      client.on('reconnect', () => {
        console.log('reconnecting');
        if (!isMounted) return;
        setMqtt('reconnecting');
        setCheckedMqtt(false);
      });
      client.on('error', (err) => {
        console.log(err);
        client.end();
        client = null;
      });
      client.on('close', () => {
        console.log('closed and component unmounted so no state update');
      });
      client.on('message', (topic, msg) => {
        if (!isMounted) return;
        const data = JSON.parse(msg);
        if (data === undefined) {
          console.log(`undefined msg : '${msg}'`);
        } else {
          receive_data(topic, data);
        }
      });
    } else {
      console.log('client already initialized');
    }
    return () => {
      client.end();
      client = null;
    };
  }, []);
};
