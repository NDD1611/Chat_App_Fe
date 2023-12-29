import axios from "../../config/axios.config";
interface DataType {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export const register = async (data: DataType) => {
    try {
        return await axios.post("/api/v1/register", data);
    } catch (exception) {
        return {
            error: true,
            exception,
        };
    }
};

interface LoginTypes {
    email: string;
    password: string;
}
export const login = async (data: LoginTypes) => {
    try {
        return await axios.post("/api/v1/login", data);
    } catch (exception) {
        return {
            error: true,
            exception,
        };
    }
};
