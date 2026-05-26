import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

const defaultOptions: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api" || "https://somaricha.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
};

const instance: AxiosInstance = axios.create(defaultOptions);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export default instance;
