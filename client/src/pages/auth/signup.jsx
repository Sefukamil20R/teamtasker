import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../service/auth-services";
import "../../styles/auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(""); // For success or error messages
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData); // Call the register API
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <header className="nav-header">
        <div className="logo">TeamTasker</div>
      </header>

      <main className="main-section">
        <div className="form-wrapper">
          <h2>Create Your Account</h2>
          <p className="form-subtitle">Join us and start managing your tasks efficiently</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-primary">Sign up</button>
          </form>

          {message && <p className="success">{message}</p>} {/* Display success message */}
          {error && <p className="error">{error}</p>} {/* Display error message */}

          <p className="form-switch">
            Already have an account? <a href="/login">Back to login</a>
          </p>
        </div>
      </main>
    </>
  );
};

export default Signup;