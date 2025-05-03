import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://teamtasker-backend-dejh.onrender.com/api",
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  console.log("Token sent with request:", token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;