"use client"

import { useState, useEffect } from "react"
import { useData } from "../components/data-provider"
import { X } from "lucide-react"
import "./TaskForm.css"

export default function TaskForm({ onClose, projectId, task = null }) {
  const { addTask, updateTask, projects } = useData()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  })
  const [errors, setErrors] = useState({})

  // Get the current project
  const project = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        assignedTo: task.assignedTo.id,
      })
    } else if (project?.members.length > 0) {
      // Default to first team member if creating new task
      setFormData((prev) => ({
        ...prev,
        assignedTo: project.members[0].id,
      }))
    }
  }, [task, project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    const newErrors = {}
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    if (!formData.assignedTo) newErrors.assignedTo = "Assigned team member is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Find the assigned team member object
    const assignedTo = project.members.find((m) => m.id === formData.assignedTo)

    if (task) {
      // Update existing task
      updateTask({
        ...task,
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        assignedTo,
      })
    } else {
      // Add new task
      addTask({
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        assignedTo,
        projectId,
      })
    }

    onClose()
  }

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2 className="task-form-title">{task ? "Edit Task" : "Create New Task"}</h2>
        <button onClick={onClose} className="close-btn">
          <X className="icon" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title" className="form-label">Task Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error-msg">{errors.title}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="error-msg">{errors.description}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="deadline" className="form-label">Deadline</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="form-input"
            value={formData.deadline}
            onChange={handleChange}
          />
          {errors.deadline && <p className="error-msg">{errors.deadline}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="assignedTo" className="form-label">Assigned To</label>
          <select
            id="assignedTo"
            name="assignedTo"
            className="form-input"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">Select Team Member</option>
            {project?.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.assignedTo && <p className="error-msg">{errors.assignedTo}</p>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}
