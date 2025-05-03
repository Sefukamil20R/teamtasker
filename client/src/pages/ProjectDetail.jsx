import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import ProjectForm from "../components/project-form";
import "../styles/project-detail.css";
import ConfirmationDialog from "../components/confirmationDialog"; // Import the confirmation dialog component

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, deleteProject, loading } = useData();
  const [project, setProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation dialog

  useEffect(() => {
    if (!loading) {
      const foundProject = projects.find((p) => p._id === id); // Match by _id
      if (foundProject) {
        setProject(foundProject);
      } else {
        navigate("/projects"); // Redirect if project not found
      }
    }
  }, [id, projects, loading, navigate]);

  const handleDeleteProject = () => {
    setShowConfirmation(true); // Show the confirmation dialog
  };

  const confirmDelete = () => {
    deleteProject(id);
    navigate("/projects");
  };

  if (loading || !project) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="back-link">
        <button onClick={() => navigate("/projects")} className="btn-link">
          Back to Projects
        </button>
      </div>

      <div className="project-card">
        <div className="project-header">
          <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>
          {user?.role === "admin" && (
            <div className="project-actions">
              <button onClick={() => setShowProjectForm(true)} className="btn-secondary">
                Edit
              </button>
              <button onClick={handleDeleteProject} className="btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="project-dates">
          <p>
            <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
          </p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${project.progress || 0}%` }}></div>
        </div>
        <p className="progress-text">{project.progress || 0}% Complete</p>

        <div className="team-members">
          <h3>Team Members</h3>
          <div className="members-list">
            {project.teamMembers.map((member) => (
              <div key={member._id} className="member-item">
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectForm onClose={() => setShowProjectForm(false)} project={project} />
          </div>
        </div>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this project?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}