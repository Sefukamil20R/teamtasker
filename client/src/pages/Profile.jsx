import React, { useEffect, useState } from "react";
import { getUserProfile } from "../service/auth-services"; 
import Navbar from "../components/Navbar"; 
import "../styles/profile.css"; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user } = await getUserProfile(); 
        setUser(user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="profile-layout">
      {/* Navbar */}
      <Navbar />

      {/* Profile Content */}
      <div className="profile-container">
        <h1>Profile</h1>
        {user && (
          <div className="profile-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}