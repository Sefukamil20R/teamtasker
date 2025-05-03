import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { useData } from "../components/data-provider";
import TaskForm from "../components/task-form";
import Navbar from "../components/Navbar";
import axios from "../utils/axios";
import "../styles/tasks.css";
import { sendNotification } from "../utils/sendNotification";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, projects, createTask, updateTask, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role === "admin") {
        setUsersLoading(true);
        try {
          const response = await axios.get("/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUsers(response.data.data);
        } catch (error) {
          console.error("Failed to fetch users:", error.response?.data || error.message);
        } finally {
          setUsersLoading(false);
        }
      }
    };

    fetchUsers();
  }, [user]);

  // Check if editingTask is passed via state and open the modal
  useEffect(() => {
    if (location.state?.editingTask) {
      setEditingTask(location.state.editingTask); 
      setShowForm(true); 
    }
  }, [location.state]);

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update task logic
        await updateTask(taskData);

        // Send notification to the assigned user if the task is updated
        if (taskData.assignedTo) {
          await sendNotification(
            taskData.assignedTo,
            `The task "${taskData.title}" has been updated.`
          );
        }
      } else {
        // Create task logic
        await createTask(taskData);

        // Send notification to the assigned user if the task is created
        if (taskData.assignedTo) {
          await sendNotification(
            taskData.assignedTo,
            `You have been assigned a new task: "${taskData.title}".`
          );
        }
      }

      closeForm(); // Close the form after submission
    } catch (error) {
      console.error("Failed to handle task submission:", error.response?.data || error.message);
    }
  };

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.title : "Unknown Project";
  };

  if (loading || usersLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Debugging the tasks array
  console.log("Tasks Array:", tasks);

  return (
    <div className="tasks-layout">
      <Navbar />

      <div className="tasks-container">
        <div className="tasks-header">
          <h1 className="text-2xl font-bold text-primary mb-4">Tasks</h1>
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
                users={users}
              />
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <p>No tasks found</p>
          </div>
        ) : (
          <div className="projects-grid">
            {tasks.map((task) => {
              // Debugging each task
              console.log("Task:", task);

              return (
                <div
                  key={task._id}
                  className="project-card"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div className="project-card-content">
                    <h2>{task.title}</h2>
                    <p><strong>Project:</strong> {getProjectTitle(task.project)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}