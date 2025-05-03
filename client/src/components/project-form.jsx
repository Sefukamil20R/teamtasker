import { useState, useEffect } from "react";
import { useData } from "./data-provider";
import { X } from "lucide-react";
import axios from "../utils/axios";

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
  const [availableUsers, setAvailableUsers] = useState([]);

  // Fetch available users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAvailableUsers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setAvailableUsers([{ _id: "static-user-1", name: "Fallback User" }]);
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
        startDate: project.startDate.split("T")[0],
        endDate: project.endDate.split("T")[0],
      });
      setSelectedMembers(project.teamMembers || []);
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

    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const projectData = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamMembers: selectedMembers,
    };

    if (project) {
      await updateProject(project._id, projectData);
    } else {
      await addProject(projectData);
    }

    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>{project ? "Edit Project" : "Create New Project"}</h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Project Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p>{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <p>{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <p>{errors.endDate}</p>}
        </div>

        <div>
          <label>Team Members</label>
          <div>
            {availableUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => toggleMember(user._id)}
              >
                <span>{user.name}</span>
              </div>
            ))}
          </div>
          {errors.teamMembers && <p>{errors.teamMembers}</p>}
        </div>

        <div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            {project ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}