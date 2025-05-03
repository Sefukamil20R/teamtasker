import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import TaskForm from "../components/task-form";
import Navbar from "../components/Navbar";
import "../styles/tasks.css";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, projects, createTask, updateTask, deleteTask, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (taskData) => {
    console.log("Submitting task:", taskData); // Debugging
    if (editingTask) {
      updateTask(taskData);
    } else {
      createTask(taskData);
    }
    closeForm();
  };

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "Unknown Project";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-layout">
      <Navbar />

      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Tasks</h1>
          {user?.role === "admin" && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Task
            </button>
          )}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <TaskForm
                onClose={closeForm}
                onSubmit={handleFormSubmit}
                task={editingTask}
                projects={projects}
              />
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <p>No tasks found</p>
            {user?.role === "admin" && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)} // Navigate to task details page
                    className="clickable-row"
                  >
                    <td>
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.description}</div>
                    </td>
                    <td>{getProjectTitle(task.project)}</td>
                    <td>
                      {task.assignedTo ? (
                        <span>{task.assignedTo.name}</span>
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </td>
                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                    <td>
                      {user?.role === "admin" ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTask({ ...task, status: e.target.value })
                          }
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${task.status}`}>
                          {task.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {user?.role === "admin" && (
                        <div className="task-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleEdit(task);
                            }}
                            className="btn-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleDelete(task._id);
                            }}
                            className="btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}