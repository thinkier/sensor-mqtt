import {SCD4x} from 'scd4x-node';
import {publish} from "./client";

publish(async function* () {
    const sensor = await SCD4x.connect();
    await sensor.setTemperatureOffset(Number.parseFloat(process.env.SCD4X_TEMP_OFFSET) ?? 0);

    try {
        await sensor.stopPeriodicMeasurement();
        console.info('Sensor soft reboot');
        await new Promise(res => setTimeout(res, 2000));
    } catch (e) {
        // Sensor not initialized to begin with, that's ok.
    }

    await sensor.setAutomaticSelfCalibrationEnabled(true);
    await sensor.startPeriodicMeasurement();
    console.info('Sensor initialized');

    await new Promise(res => setTimeout(res, 5000))
    console.info("Sensor ready");

    while (true) {
        if (!(await sensor.isDataReady())) return;
        yield await sensor.readMeasurement();
        await new Promise(res => setTimeout(res, 5000));
    }
}).then();
