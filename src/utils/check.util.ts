export const checkLeapYear = (year: any) => {
    let intYear = parseInt(year)
    if (((intYear % 4 === 0) && (intYear % 100 !== 0)) || (intYear % 400 === 0)) {
        return true
    } else {
        return false
    }
}