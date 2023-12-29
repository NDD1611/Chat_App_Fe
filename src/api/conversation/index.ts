import { checkErr } from "@/utils/check.util";
import axios from "../../config/axios.config";

export let createConversation = async (data: any) => {
    try {
        return await axios.post("/api/v1/conversation/without-message", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export let createNewConversation = async (data: any) => {
    // have first message
    try {
        return await axios.post("/api/v1/conversation/with-message", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export let deleteConversation = async (data: any) => {
    try {
        return await axios.delete("/api/v1/conversation", { data });
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export let createGroupApi = async (data: any) => {
    try {
        return await axios.post("/api/v1/conversation/group", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};
