export const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function replaceUnderscore(inputString) { 
    return inputString.replace(/_/g, ' ');
}