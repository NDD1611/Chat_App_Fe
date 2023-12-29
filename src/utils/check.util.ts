import { logout } from "./auth.util";
export const checkLeapYear = (year: any) => {
    let intYear = parseInt(year);
    if ((intYear % 4 === 0 && intYear % 100 !== 0) || intYear % 400 === 0) {
        return true;
    } else {
        return false;
    }
};

export const checkErr = (exception: any) => {
    const errCode = exception?.response?.status;
    if (errCode === 401 || errCode === 403) {
        logout();
    }
};
