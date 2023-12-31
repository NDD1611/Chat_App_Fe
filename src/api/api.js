import axios from "./axios";
import axiosFile from "./axiosSendFile";
import { logout } from "../utils/auth.util";

const refreshToken = async (userDetails) => {
    try {
        let response = await axios.post("/auth/refresh-token", { userDetails: userDetails });
        return response;
    } catch (exception) {
        return {
            err: true,
            exception,
        };
    }
};

//secure router
const uploadAvatar = async (data) => {
    try {
        let response = await axios.post("/file/upload-avatar", data);
        return response;
    } catch (exception) {
        checkErr(exception);
        return {
            err: true,
            exception,
        };
    }
};

const uploadImageMessage = async (data) => {
    try {
        let response = await axios.post("/file/upload-image-message", data);
        return response;
    } catch (exception) {
        checkErr(exception);
        return {
            err: true,
            exception,
        };
    }
};

const checkErr = (exception) => {
    const errCode = exception?.response?.status;
    if (errCode === 401 || errCode === 403) {
        logout();
    }
};

let uploadFile = async (data) => {
    try {
        let response = await axiosFile.post("/file/upload-file-message", data);
        return response;
    } catch (exception) {
        checkErr(exception);
        return {
            err: true,
            exception,
        };
    }
};

let downLoadFile = async (data) => {
    try {
        let response = await axiosFile.post("/file/download", data, {
            headers: {
                responseType: "arraybuffer",
            },
        });
        return response;
    } catch (exception) {
        checkErr(exception);
        return {
            err: true,
            exception,
        };
    }
};
let testQueryLimit = async () => {
    try {
        let response = await axiosFile.get("/test-query-limit");
        return response;
    } catch (exception) {
        checkErr(exception);
        return {
            err: true,
            exception,
        };
    }
};

export default {
    refreshToken,
    uploadFile,
    uploadAvatar,
    uploadImageMessage,
    downLoadFile,
    testQueryLimit,
};
