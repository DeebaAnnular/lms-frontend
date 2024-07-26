export const capitalizeWords = (str) => { 
    if(str != null){
        return str.replace(/\b\w/g, (char) => char.toUpperCase()); 
    }

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
export function convertDateStringWithHifn(dateString) {
    // Parse the date string
    let date = new Date(dateString);
    
    // Get year, month, and day
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = date.getDate().toString().padStart(2, '0');

    // Return formatted date string
    return `${year}-${month}-${day}`;
}

export function convertDate(inputDate) {
    // Split the input date by the hyphen
    const [day, month, year] = inputDate.split('-');
    
    // Rearrange and return the date in yyyy-mm-dd format
    return `${year}-${month}-${day}`;
}

export function replace(inputDate) {
    // Split the input date by the hyphen
    const [year, month, date] = inputDate.split('/');
    
    // Rearrange and return the date in yyyy-mm-dd format
    return `${year}-${month}-${date}`;
}


    const validateTime = (time) => {
        const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    };