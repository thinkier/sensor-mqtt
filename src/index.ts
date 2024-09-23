// @ts-ignore
import {Bme680} from 'bme680-sensor';
import mqtt from 'mqtt';

async function main() {
    const client = await mqtt.connectAsync(process.env.MQTT_ENDPOINT ?? "mqtt://test.mosquitto.org");
    console.info('MQTT client initialized');
    const sensor = new Bme680(1, 0x76);
    await sensor.initialize();
    await sensor.setGasHeaterTemperature(0);
    console.info('Sensor initialized');

    setInterval(async () => {
        let data = await sensor.getSensorData();
        client.publish("bme68x", JSON.stringify({...data.data}));
    }, Number.parseInt(process.env.SENSOR_INTERVAL) ?? 1000);
}

main().then();
