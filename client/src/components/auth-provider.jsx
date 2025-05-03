import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUserProfile } from "../service/auth-services";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on app load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { user } = await getUserProfile();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        localStorage.removeItem("token"); // Remove invalid token
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Register a new user
  const register = async (userData) => {
    const { token } = await registerUser(userData);
    localStorage.setItem("token", token);
    const { user } = await getUserProfile();
    setUser(user);
  };

  // Login a user
  const login = async (credentials) => {
    const { token } = await loginUser(credentials);
    localStorage.setItem("token", token);
    const { user } = await getUserProfile();
    setUser(user);
  };

  // Logout the user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};