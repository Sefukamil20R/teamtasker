"use client";

import { useState, useEffect } from "react";
import { useData } from "./data-provider";
import { X } from "lucide-react";
import axios from "../utils/axios"; // Import axios for API calls

export default function ProjectForm({ onClose, project = null }) {
  const { addProject, updateProject } = useData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]); // List of users fetched from the backend

  // Fetch available users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users"); // Replace with your actual endpoint
        setAvailableUsers(response.data.data); // Assuming the response contains a `data` array
      } catch (error) {
        console.error("Failed to fetch users, using fallback user:", error);
        // Fallback static user
        setAvailableUsers([
          { _id: "static-user-1", name: "Fallback User" },
        ]);
      }
    };

    fetchUsers();
  }, []);

  // Populate form data if editing a project
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        startDate: project.startDate.split("T")[0], // Format date for input
        endDate: project.endDate.split("T")[0], // Format date for input
      });
      setSelectedMembers(project.teamMembers); // Use team member IDs
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
  
    // Temporarily bypass team member validation
    // if (selectedMembers.length === 0) newErrors.teamMembers = "At least one team member is required";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // Prepare data for API
    const projectData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamMembers: selectedMembers, // Send selected member IDs
    };
  
    if (project) {
      // Update existing project
      await updateProject(project._id, projectData);
    } else {
      // Add new project
      await addProject(projectData);
    }
  
    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">{project ? "Edit Project" : "Create New Project"}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Project Title
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="input-field"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="input-field"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Team Members</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedMembers.includes(user._id) ? "bg-accent text-primary" : "bg-gray-100"
                }`}
                onClick={() => toggleMember(user._id)}
              >
                <span>{user.name}</span>
              </div>
            ))}
          </div>
          {errors.teamMembers && <p className="text-red-500 text-xs mt-1">{errors.teamMembers}</p>}
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
            {project ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}