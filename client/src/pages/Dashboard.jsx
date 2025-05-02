import React from "react";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import your Navbar component
import { Briefcase, CheckCircle, Clock, ListTodo } from "lucide-react";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { getStats, loading } = useData();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = getStats();

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
              value={stats.totalProjects}
              icon={<Briefcase />}
            />
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon={<ListTodo />}
            />
            <StatCard
              title="Completed Tasks"
              value={stats.completedTasks}
              icon={<CheckCircle />}
            />
            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon={<Clock />}
            />
          </div>

          {/* Progress Section */}
          <div className="progress-card">
            <h2 className="progress-title">Overall Project Completion</h2>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${stats.overallProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">{stats.overallProgress}% Complete</p>
          </div>
         
        </div>
      </div>
       {/* footer */}
       <Footer />

    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">Dashboard</li>
        <li className="sidebar-item">Projects</li>
        <li className="sidebar-item">Tasks</li>
        <li className="sidebar-item">Notifications</li>
        <li className="sidebar-item">Settings</li>
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