import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // return only data
  (error) => {
    // Handle timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout" });
    }

    // Handle server errors
    if (error.response?.status === 500) {
      return Promise.reject({ message: "Server error" });
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
