import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// const baseURL: string = window.location.hostname === 'localhost'
//     ? (window.location.host === 'localhost:8080' || window.location.host === 'localhost:5173' ? 'http://localhost:5000' : 'https://twoapi.qiangtu.com')
//     : `//${window.location.hostname}:${window.location.port}`;

const baseURL: string = window.location.hostname === 'localhost'
    ? (window.location.host === 'localhost:8080' || window.location.host === 'localhost:5173' ? 'http://localhost:5173/api' : 'https://note2exam.qiangtu.com')
    : `//${window.location.hostname}:${window.location.port}`;

const modifyConfig = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Your modification logic here
    return config;
};

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => modifyConfig(config));

// OR if you must use AxiosRequestConfig and cast it appropriately
axios.interceptors.request.use((config) => modifyConfig(config as InternalAxiosRequestConfig));


const service: AxiosInstance = axios.create({
    baseURL,
    withCredentials: false,
    timeout: 300000,
});

service.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => Promise.reject(error)
);

export default service;
