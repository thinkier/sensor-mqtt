// @ts-ignore
import {Bme680} from 'bme680-sensor';
import mqtt from 'mqtt';

async function main() {
    const client = await mqtt.connectAsync(process.env.MQTT_ENDPOINT ?? "mqtt://test.mosquitto.org");
    console.info('MQTT client initialized');
    const sensor = new Bme680(1, 0x76);
    await sensor.initialize()
    console.info('Sensor initialized');

    await client.subscribeAsync(["bme68x"]);
    client.prependListener("message", (ty, msg) => {
        console.info(JSON.parse(msg.toString()));
    });

    setInterval(async () => {
        let data = await sensor.getSensorData();
        client.publish("bme68x", JSON.stringify({...data.data}));
    }, 3000);
}

main().then();
