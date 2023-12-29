import { checkErr } from "@/utils/check.util";
import axios from "../../config/axios.config";

export const findFriend = async (data: { email: string }) => {
    try {
        return await axios.post("/api/v1/friend/find", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export const friendInvitation = async (data: { senderId: string; receiverId: string }) => {
    try {
        return await axios.post("/api/v1/friend/invitation", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};
export const acceptInvitation = async (data: { invitationId: string }) => {
    try {
        return await axios.post("/api/v1/friend/accept", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export const rejectInvitation = async (data: { invitationId: string; receiverId: string }) => {
    try {
        return await axios.post("/api/v1/friend/reject", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};

export const deleteFriend = async (data: { userId: string; friendId: string }) => {
    try {
        return await axios.post("/api/v1/friend/delete", data);
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};
