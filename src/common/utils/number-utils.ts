
export const tryParseInt = (value: any): number | null => {
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
};

export const isNumeric = (value: any): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const roundToDecimals = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

export const percentage = (part: number, total: number): number => {
    return total === 0 ? 0 : (part / total) * 100;
};

export const formatWithThousandsSeparator = (value: number): string => {
    return value.toLocaleString();
};
  