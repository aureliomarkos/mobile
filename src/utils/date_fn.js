const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const dateTimeToForm = (date) => {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    const day = date.slice(8, 10)
    const hours = date.slice(11, 13)
    const minutes = date.slice(14, 16)
    const seconds = date.slice(17, 19)
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

const dateToSql = (date) => {
    const day = date.slice(0, 2)
    const month = date.slice(3, 5)
    const year = date.slice(6, 10)
    return `${year}-${month}-${day}`
}

const dateToForm = (date) => {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    const day = date.slice(8, 10)
    return `${day}${month}${year}`
}


const validDate = (dateStr) => {
    const datePattern = /^(\d{2}).(\d{2}).(\d{4})$/;
    const match = dateStr.match(datePattern);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Mês no objeto Date é 0-indexado (0 = Janeiro)
    const year = parseInt(match[3], 10);
    
    const date = new Date(year, month, day);
    
    // Verifica se a data é válida e se os componentes correspondem
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}


export { formatDate, dateTimeToForm, dateToSql, dateToForm, validDate }