import React, { useState } from "react";
import { useAuth } from "../components/auth-provider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, CheckCircle, Clock, ListTodo } from "lucide-react";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [progress] = useState(75); 

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <Navbar />

      <div className="dashboard-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Welcome Section */}
          <div className="welcome-card">
            <h1 className="welcome-title">Welcome back, {user?.name}!</h1>
            <p className="welcome-subtitle">
              Here's an overview of your team's progress
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <StatCard
              title="Total Projects"
              value="3" // 
              icon={<Briefcase />}
            />
            <StatCard
              title="Total Tasks"
              value="3" 
              icon={<ListTodo />}
            />
            <StatCard
              title="Completed Tasks"
              value="1" 
              icon={<CheckCircle />}
            />
            <StatCard
              title="Pending Tasks"
              value="2" 
              icon={<Clock />}
            />
          </div>

          {/* Progress Section */}
          <div className="progress-card">
            <h2 className="progress-title">Overall Project Completion</h2>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{progress}% Complete</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/projects" className="sidebar-link">Projects</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/tasks" className="sidebar-link">Tasks</Link>
        </li>
        {/* <li className="sidebar-item">
          <Link to="/notifications" className="sidebar-link">Notifications</Link>
        </li> */}
        <li className="sidebar-item">
          <Link to="/Profile" className="sidebar-link">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}