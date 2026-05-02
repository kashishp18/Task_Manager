import axios from 'axios';

const API = axios.create({ baseURL: 'http://taskmanager-production-9f59.up.railway.app' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token && req.headers) {
        req.headers.Authorization = token;
    }
    return req;
});

export default API;