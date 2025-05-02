import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import ProjectForm from "../components/project-form";
import TaskForm from "../components/task-form";
import "../styles/project-detail.css"; // Import the custom CSS file

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, deleteProject, getProjectTasks, loading } = useData();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (!loading) {
      const foundProject = projects.find((p) => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        setTasks(getProjectTasks(id));
      } else {
        navigate("/projects");
      }
    }
  }, [id, projects, loading, getProjectTasks, navigate]);

  const handleDeleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      navigate("/projects");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
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
          <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
        </div>
        <p className="progress-text">{project.progress}% Complete</p>

        <div className="team-members">
          <h3>Team Members</h3>
          <div className="members-list">
            {project.members.map((member) => (
              <div key={member.id} className="member-item">
                <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Project Tasks</h2>
          {user?.role === "admin" && (
            <button onClick={() => setShowTaskForm(true)} className="btn-primary">
              Add Task
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <p>No tasks found for this project</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Deadline</th>
                <th>Status</th>
                {user?.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedTo.name}</td>
                  <td>{new Date(task.deadline).toLocaleDateString()}</td>
                  <td>{task.status}</td>
                  {user?.role === "admin" && (
                    <td>
                      <button onClick={() => handleEditTask(task)} className="btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => deleteProject(task.id)} className="btn-danger">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectForm onClose={() => setShowProjectForm(false)} project={project} />
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              onClose={() => setShowTaskForm(false)}
              projectId={id}
              task={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}