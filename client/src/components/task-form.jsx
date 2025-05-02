"use client"

import { useState, useEffect } from "react"
import { useData } from "./data-provider"
import { X } from "lucide-react"

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">{task ? "Edit Task" : "Create New Task"}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Task Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="input-field"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="input-field"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="deadline">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="input-field"
            value={formData.deadline}
            onChange={handleChange}
          />
          {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="assignedTo">
            Assigned To
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            className="input-field"
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
          {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}
