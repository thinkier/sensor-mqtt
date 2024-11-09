import mqtt from "mqtt";

export async function publish(generator: () => AsyncIterator<any>) {
    let iterator = generator();
    let client = null;
    if (process.env.MQTT_ENDPOINT) {
        client = await mqtt.connectAsync(process.env.MQTT_ENDPOINT);
        console.info('MQTT client initialized');
    } else {
        console.warn("MQTT_ENDPOINT not specified, running in debug mode");
    }

    let item = await iterator.next();
    while (!item.done) {
        await client?.publishAsync("v1/devices/me/telemetry", JSON.stringify(item.value));
        console.info("Data:", item.value);
        item = await iterator.next();
    }
}
