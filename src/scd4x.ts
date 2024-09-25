import {SCD4x} from 'scd4x-node';
import mqtt from 'mqtt';

async function main() {
    const client = await mqtt.connectAsync(process.env.MQTT_ENDPOINT ?? "mqtt://test.mosquitto.org");
    console.info('MQTT client initialized');
    const sensor = await SCD4x.connect();

    try {
        await sensor.startPeriodicMeasurement();
        await new Promise(res => setTimeout(res, 5000))
        console.info('Sensor initialized');
    } catch (e) {
        console.info('Stopping existing sensor session');
        await sensor.stopPeriodicMeasurement();
        await sensor.disconnect();
        return;
    }

    console.info("Sensor ready");

    setInterval(async () => {
        if (!(await sensor.isDataReady())) return;
        let data = await sensor.readMeasurement();
        await client.publishAsync("v1/devices/me/telemetry", JSON.stringify(data));
        console.info("Pushed new data to server:", data);
    }, 5000);
}

main().then();
