
export function timestampToDateTimeString(timestamp: number): string {
    let date = new Date(timestamp * 1000);

    // Extract date components
    let month = date.getMonth() + 1; // Months are zero indexed
    let day = date.getDate();
    let year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();

    // Format date string MM/DD/YYYY HH:mm
    let formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes.substr(-2)}`;

    return formattedDateTime;
}

export function isoToCustomFormat(isoDateString: string): string {
    const date = new Date(isoDateString);

    // Extract date components
    const month = date.getMonth() + 1; // Months are zero indexed
    const day = date.getDate();
    const year = date.getFullYear();

    // Extract time components
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    // Format date string MM/DD/YYYY HH:mm
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes.substr(-2)}`;

    return formattedDateTime;
}
