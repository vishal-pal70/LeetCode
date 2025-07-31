import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://nexuscode-backend.onrender.com/user/login',
    withCredentials: true,
    headers:{
        'content-type': 'application/json'
    }
});


export default axiosClient;
