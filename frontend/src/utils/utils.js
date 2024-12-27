export function convertUTCToIST(utcDateStr) {
    // Create a new Date object from the UTC date string
    const utcDate = new Date(utcDateStr);

    // Use toLocaleString with the 'Asia/Kolkata' time zone for correct IST conversion
    return utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}