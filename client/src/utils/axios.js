import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://teamtasker-backend-dejh.onrender.com/api", // Base URL for the API
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  console.log("Token sent with request:", token); // Debugging
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;