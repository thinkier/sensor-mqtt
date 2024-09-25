// @ts-ignore
import {Bme680} from 'bme680-sensor';
import mqtt from 'mqtt';
import {publish} from "./client";

publish(async function* () {
    const sensor = new Bme680(1, 0x76);
    await sensor.initialize();
    sensor.setTempOffset(Number.parseFloat(process.env.BME68X_TEMP_OFFSET) ?? 0);
    await sensor.setGasHeaterTemperature(0);
    console.info('Sensor initialized');

    while (true) {
        yield (await sensor.getSensorData()).data;
        await new Promise(res => setTimeout(res, 5000));
    }
}).then();
