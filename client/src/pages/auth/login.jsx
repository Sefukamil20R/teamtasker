import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "../../service/auth-services";
import "../../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const { token } = await loginUser(formData); // Call the login API
      localStorage.setItem("token", token); // Store the token in localStorage
      console.log("Token stored in localStorage:", localStorage.getItem("token")); // Debugging
  
      // Fetch the user's profile to determine their role
      const { user } = await getUserProfile();
      console.log("User role:", user.role); // Debugging
  
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard"); // Redirect admin to the dashboard
        } else {
          navigate("/profile"); // Redirect member to the profile page
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <header className="nav-header">
        <div className="logo">TeamTasker</div>
      </header>

      <main className="main-section">
        <div className="form-wrapper">
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Log in to access your projects and tasks</p>

          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="form-footer">
              <a href="/forgot-password" className="link-primary">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary">Login</button>
          </form>

          {message && <p className="success">{message}</p>} {/* Display success message */}
          {error && <p className="error">{error}</p>} {/* Display error message */}

          <p className="form-switch">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;