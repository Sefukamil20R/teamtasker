import React, { useState, useEffect } from "react";

export default function TaskForm({ onClose, onSubmit, task, projects }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    project: "",
    deadline: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo || "",
        project: task.project || "",
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, _id: task?._id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="project">Project</label>
        <select
          id="project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="assignedTo">Assigned To</label>
        <input
          id="assignedTo"
          name="assignedTo"
          type="text"
          value={formData.assignedTo}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}