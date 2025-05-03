import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth-provider";
import "../../styles/auth.css";

const Login = () => {
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);  // Use login from context
      setError(""); // Reset error message on success
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

            <button type="submit" className="btn-primary" disabled={authLoading}>
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </form>

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
