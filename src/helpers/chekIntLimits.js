export default function checkIntLimits(value, min, max) {
    value = Math.round(value);
    return (value < min) ? min : (value > max) ? max : value;
}
