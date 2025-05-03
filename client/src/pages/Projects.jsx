import React, { useState } from "react";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/project-form";
import Navbar from "../components/Navbar";
import "../styles/projects.css";

export default function Projects() {
  const { user } = useAuth();
  const { projects, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="projects-layout">
      {/* Navbar */}
      <Navbar />

      <div className="projects-container">
        <div className="projects-header">
          <h1>Projects</h1>
          {user?.role === "admin" && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create New Project
            </button>
          )}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <ProjectForm onClose={closeForm} project={editingProject} />
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="empty-projects">
            <p>No projects found</p>
            {user?.role === "admin" && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project._id}
                className="project-card"
                onClick={() => handleCardClick(project._id)}
              >
                <div className="project-card-content">
                  <h2>{project.title}</h2>
                  <div className="project-dates">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}