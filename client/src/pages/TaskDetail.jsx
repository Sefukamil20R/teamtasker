import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../components/data-provider";
import "../styles/task-detail.css";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading } = useData();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const foundTask = tasks.find((t) => t._id === id);
    if (foundTask) {
      setTask(foundTask);
    } else {
      navigate("/tasks"); // Redirect if task not found
    }
  }, [id, tasks, navigate]);

  if (loading || !task) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="task-detail-container">
      <button onClick={() => navigate("/tasks")} className="btn-link">
        Back to Tasks
      </button>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>
        <strong>Project:</strong> {task.project}
      </p>
      <p>
        <strong>Assigned To:</strong> {task.assignedTo || "Unassigned"}
      </p>
      <p>
        <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
    </div>
  );
}