/**
 * Calculate the absolute humidity
 *
 * @param degC Temperature in degrees Celsius, this formula is only a good approximate for inputs between 0 and 100 C
 * @param rh Relative Humidity percentage, from 0 to 100
 *
 * @returns Absolute Humidity in g/m^3
 */
export function absoluteHumidity(degC: number, rh: number): number {
    let degK = degC + 273.15;

    // Tetens formula
    const a = 6.1121;
    const b = 17.502;
    const c = 240.97;
    let satVapourPressure = a * Math.exp(b * degC / (degC + c));

    let actualVapourPressure = rh * satVapourPressure / 100;
    return 216.7 * actualVapourPressure / degK;
}
