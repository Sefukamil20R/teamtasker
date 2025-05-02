import axios from "../utils/axios";

// Register a new user
export const registerUser = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

// Login a user
export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  return response.data;
};

// Get the logged-in user's profile
export const getUserProfile = async () => {
    const response = await axios.get("/auth/me");
    return response.data;
  };