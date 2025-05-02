import React, { useState } from "react";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import TaskForm from "../components/task-form";
import Navbar from "../components/Navbar"; // Import Navbar
import "../styles/tasks.css"; // Import the custom CSS file

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, projects, deleteTask, updateTask, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

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

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status !== "completed";
    return true;
  });

  // Get project title by id
  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
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
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="tasks-container">
        {/* Header */}
        <div className="tasks-header">
          <h1>Tasks</h1>
          <div className="tasks-controls">
            <div className="filter-container">
              <label htmlFor="filter">Filter:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            {user?.role === "admin" && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Modal for Task Form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <TaskForm
                onClose={closeForm}
                projectId={editingTask?.projectId || projects[0]?.id}
                task={editingTask}
              />
            </div>
          </div>
        )}

        {/* Tasks Table */}
        {filteredTasks.length === 0 ? (
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
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.description}</div>
                    </td>
                    <td>{getProjectTitle(task.projectId)}</td>
                    <td>
                      <div className="assigned-to">
                        {task.assignedTo ? (
                          <span>{task.assignedTo.name}</span>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
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
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${task.status}`}>
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td>
                      {user?.role === "admin" && (
                        <div className="task-actions">
                          <button
                            onClick={() => handleEdit(task)}
                            className="btn-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
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