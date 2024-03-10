import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 30000,
});

apiClient.interceptors.request.use(
    function (config) {
        const tokenJson = localStorage.getItem("tokens");
        const tokens = tokenJson ? JSON.parse(tokenJson) : null;
        console.log(tokens);
        if (tokens) {
            config.headers.authorization = tokens.accessToken;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

export default apiClient;
