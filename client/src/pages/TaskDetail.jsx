import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../components/data-provider";
import axios from "../utils/axios";
import ConfirmationModal from "../components/confirmationDialog"; // Import your ConfirmationModal component
import "../styles/task-detail.css";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, deleteTask } = useData();
  const [task, setTask] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control the modal visibility

  useEffect(() => {
    const fetchTask = async () => {
      const foundTask = tasks.find((t) => t._id === id);
      setTask(foundTask);

      if (foundTask?.assignedTo) {
        try {
          // Ensure `assignedTo` is a string (user ID)
          const userId = typeof foundTask.assignedTo === "object" ? foundTask.assignedTo._id : foundTask.assignedTo;

          const response = await axios.get(`/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the authorization token
            },
          });
          setAssignedUser(response.data.data);
        } catch (error) {
          console.error("Failed to fetch assigned user:", error.response?.data || error.message);
        }
      }
    };

    fetchTask();
  }, [id, tasks]);

  const handleDelete = () => {
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const confirmDelete = () => {
    deleteTask(task._id); // Delete the task
    navigate("/tasks"); // Navigate back to the tasks page
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-detail-container">
      <button onClick={() => navigate("/tasks")} className="btn-link back-link">
        Back to Tasks
      </button>
      <div className="project-card">
        <div className="project-header">
          <h1>{task.title}</h1>
        </div>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Project:</strong> {projects.find((p) => p._id === task.project)?.title || "Unknown Project"}</p>
        <p><strong>Assigned To:</strong> {assignedUser ? assignedUser.name : "Unassigned"}</p>
        <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <div className="project-actions">
          <button onClick={() => navigate("/tasks", { state: { editingTask: task } })} className="btn-primary">
            Edit Task
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Delete Task
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          onConfirm={confirmDelete} // Confirm deletion
          onCancel={() => setShowConfirmModal(false)} // Close the modal
        />
      )}
    </div>
  );
}