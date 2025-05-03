import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "../../service/auth-services";
import "../../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile()
        .then(({ user }) => {
          if (user.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/profile");
          }
        })
        .catch(() => {
          // Handle invalid or expired token
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      // Login and store token
      const { token } = await loginUser(formData);
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", localStorage.getItem("token"));

      // Fetch user profile
      const { user } = await getUserProfile();
      console.log("User role:", user.role);

      setMessage("Login successful");

      // Navigate based on user role
      if (user.role === "admin") {
        console.log("Navigating to Dashboard...");
        navigate("/dashboard");
      } else {
        console.log("Navigating to Profile...");
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Stop loading
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

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <p className="form-switch">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;