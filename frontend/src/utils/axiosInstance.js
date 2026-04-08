import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
  (response) => response,
  (error) => {
    console.error("[Axios Error]", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        message: "Request timeout. Please check your connection and try again.",
      });
    }

    // Handle network errors
    if (!error.response) {
      // Just reject error, offline page is already handled in App component
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
      });
    }

    // Handle server errors
    if (error.response?.status === 500) {
      return Promise.reject({
        message: "Server error. Please try again later.",
      });
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosInstance;
