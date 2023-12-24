import axios from 'axios'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 30000
})

apiClient.interceptors.request.use(function (config) {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'))
    if (userDetails) {
        config.headers.token = userDetails.token
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});


export default apiClient;

