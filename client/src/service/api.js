import axios from 'axios';

const apiUrl = 'https://quill-a-blogging-website-4.onrender.com'
// const apiUrl = 'http://localhost:5000/'

const axiosInstance = axios.create(
    {
        baseURL: apiUrl,
        headers: {
            "content-type": "application/json",
        },
        timeout: 10000
    }

)

axiosInstance.interceptors.request.use((config) => {
    return config
}, (err) => {return Promise.reject(err)} )


axiosInstance.interceptors.response.use((response) => {
    return response;
}, (err) => {return Promise.reject(err)} )

export default axiosInstance;