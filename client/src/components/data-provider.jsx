import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/projects");
      setProjects(response.data.data); // Set projects from response
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Add a new project
  const addProject = async (projectData) => {
    try {
      const response = await axios.post("/projects", projectData);
      setProjects((prev) => [...prev, response.data.data]); // Add new project to state
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  // Update an existing project
  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.put(`/projects/${projectId}`, projectData);
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId ? response.data.data : project
        )
      ); // Update project in state
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project._id !== projectId)); // Remove project from state
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      setTasks(response.data.data); // Set tasks from response
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async (taskData) => {
    try {
      console.log("Creating task with data:", taskData); // Debugging
      const response = await axios.post("/tasks", taskData);
      console.log("Task created successfully:", response.data); // Debugging
      setTasks((prev) => [...prev, response.data.data]); // Add new task to state
    } catch (error) {
      console.error("Failed to create task:", error.response?.data || error.message);
    }
  };

  // Update an existing task
  const updateTask = async (taskData) => {
    try {
      const response = await axios.put(`/tasks/${taskData._id}`, taskData);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskData._id ? response.data.data : task
        )
      ); // Update task in state
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId)); // Remove task from state
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProjects(), fetchTasks()]).finally(() => setLoading(false));
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