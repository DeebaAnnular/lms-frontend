export const capitalizeWords = (str) => { 
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function replaceUnderscore(inputString) { 
    return inputString.replace(/_/g, ' ');
}

export function convertDateString(dateString) {
    // Parse the date string
    let date = new Date(dateString);
    
    // Get year, month, and day
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = date.getDate().toString().padStart(2, '0');

    // Return formatted date string
    return `${year}/${month}/${day}`;
}