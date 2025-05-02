import React, { useState } from "react";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/project-form";
import Navbar from "../components/Navbar"; // Import Navbar
import "../styles/projects.css"; // Import the custom CSS file

export default function Projects() {
  const { user } = useAuth();
  const { projects, loading, deleteProject } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`); // Navigate to the ProjectDetails page
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
                key={project.id}
                className="project-card"
                onClick={() => handleCardClick(project.id)} // Make the card clickable
              >
                <div className="project-card-content">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>

                  <div className="project-dates">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="project-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleEdit(project);
                      }}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDelete(project.id);
                      }}
                      className="btn-danger"
                    >
                      Delete
                    </button>
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