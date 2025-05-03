import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); 

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/projects");
      setProjects(response.data.data); 
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  
const fetchUsers = async () => {
  try {
    const response = await axios.get("/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
      },
    });
    setUsers(response.data.data); // Set users from response
  } catch (error) {
    console.error("Failed to fetch users:", error.response?.data || error.message);
  }
};

  const addProject = async (projectData) => {
    try {
      const response = await axios.post("/projects", projectData);
      setProjects((prev) => [...prev, response.data.data]); 
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.put(`/projects/${projectId}`, projectData);
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId ? response.data.data : project
        )
      ); 
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project._id !== projectId)); 
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      setTasks(response.data.data); 
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async (taskData) => {
    try {
      console.log("Creating task with data:", taskData); 
      const response = await axios.post("/tasks", taskData);
      console.log("Task created successfully:", response.data); 
      setTasks((prev) => [...prev, response.data.data]); 
    } catch (error) {
      console.error("Failed to create task:", error.response?.data || error.message);
    }
  };

  const updateTask = async (taskData) => {
    try {
      const response = await axios.put(`/tasks/${taskData._id}`, taskData);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskData._id ? response.data.data : task
        )
      ); 
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId)); 
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProjects(), fetchTasks(),fetchUsers()]).finally(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        loading,
        addProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};