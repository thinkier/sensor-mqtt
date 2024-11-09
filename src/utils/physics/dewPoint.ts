/**
 * Calculate the dew point (the temperature at which water vapour will start condensing out of the air)
 *
 * @param degC Temperature in degrees Celsius
 * @param rh Relative Humidity percentage, from 0 to 100
 *
 * @returns Dew Point in degrees Celsius
 */
export function dewPoint(degC: number, rh: number): number {
    // Magnus-Tetens formula
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * degC) / (b + degC)) + Math.log(rh / 100);
    return (b * alpha) / (a - alpha);
}