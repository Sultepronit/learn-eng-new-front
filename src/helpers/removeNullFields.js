export default function removeNullFields(input) {
    const result = {};
    for(const field in input) {
        if(input[field] !== null) result[field] = input[field];
    }
    return result;
}