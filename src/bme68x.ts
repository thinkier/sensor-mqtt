// @ts-ignore
import {Bme680} from 'bme680-sensor';
import {publish} from "./utils/client";
import {absoluteHumidity} from "./utils/physics/absoluteHumidity";
import {dewPoint} from "./utils/physics/dewPoint";

publish(async function* () {
    const sensor = new Bme680(1, 0x76);
    await sensor.initialize();
    sensor.setTempOffset(Number.parseFloat(process.env.BME68X_TEMP_OFFSET) ?? 0);
    await sensor.setGasHeaterTemperature(0);
    console.info('Sensor initialized');

    let i = 36;
    while (true) {
        let data = (await sensor.getSensorData()).data;
        if (i-- <= 0) {
            data.absolute_humidity = absoluteHumidity(data.temperature, data.humidity);
            data.dew_point = dewPoint(data.temperature, data.humidity);
            yield data;
        }
        await new Promise(res => setTimeout(res, 5000));
    }
}).then();
