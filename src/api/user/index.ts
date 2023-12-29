import { checkErr } from "@/utils/check.util";
import axios from "../../config/axios.config";

export const updateUserInfo = async (data: any) => {
    try {
        return await axios.patch("/api/v1/user", { userDetails: data });
    } catch (exception) {
        checkErr(exception);
        return {
            error: true,
            exception,
        };
    }
};
