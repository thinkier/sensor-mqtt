import mqtt from "mqtt";

export async function publish(generator: () => AsyncIterator<any>) {
    let iterator = generator();

    if (process.env.MQTT_ENDPOINT) {
        const client = await mqtt.connectAsync(process.env.MQTT_ENDPOINT);
        console.info('MQTT client initialized');

        while (true) {
            let data = await iterator.next();
            await client.publishAsync("v1/devices/me/telemetry", JSON.stringify(data));
            console.info("Published:", data);
        }
    } else {
        console.warn("MQTT_ENDPOINT not specified, running in debug mode");
        while (true) {
            console.info("Data:", await iterator.next());
        }
    }
}