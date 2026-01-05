
export const generateBellCurveData = (salaries: number[]) => {
    if (!salaries || salaries.length === 0) return [];

    const n = salaries.length;
    const mean = salaries.reduce((a, b) => a + b, 0) / n;
    const variance = salaries.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return [];

    const points = [];
    const min = mean - 4 * stdDev;
    const max = mean + 4 * stdDev;
    const step = (max - min) / 50;

    const normalY = (x: number, mean: number, stdDev: number) => {
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };

    for (let x = min; x <= max; x += step) {
        points.push({
            salary: Math.round(x),
            frequency: normalY(x, mean, stdDev)
        });
    }

    return points;
};
