"use client"

import { createContext, useContext, useState, useEffect } from "react"

const DataContext = createContext()

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage or initialize with sample data
    const storedProjects = localStorage.getItem("projects")
    const storedTasks = localStorage.getItem("tasks")
    const storedNotifications = localStorage.getItem("notifications")

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    } else {
      // Sample projects
      const sampleProjects = [
        {
          id: "1",
          title: "Website Redesign",
          description: "Redesign the company website with modern UI/UX",
          startDate: "2023-05-01",
          endDate: "2023-06-15",
          members: [
            { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
            { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
          ],
          progress: 75,
        },
        {
          id: "2",
          title: "Mobile App Development",
          description: "Develop a mobile app for iOS and Android",
          startDate: "2023-06-01",
          endDate: "2023-08-30",
          members: [
            { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
            { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=40&width=40" },
          ],
          progress: 30,
        },
      ]
      setProjects(sampleProjects)
      localStorage.setItem("projects", JSON.stringify(sampleProjects))
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      // Sample tasks
      const sampleTasks = [
        {
          id: "1",
          title: "Design Homepage Mockup",
          description: "Create mockup for the new homepage design",
          projectId: "1",
          assignedTo: { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
          deadline: "2023-05-15",
          status: "completed",
        },
        {
          id: "2",
          title: "Implement Homepage",
          description: "Implement the homepage based on the approved design",
          projectId: "1",
          assignedTo: { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
          deadline: "2023-06-01",
          status: "in-progress",
        },
        {
          id: "3",
          title: "App Wireframes",
          description: "Create wireframes for the mobile app",
          projectId: "2",
          assignedTo: { id: "3", name: "Bob Johnson", avatar: "/placeholder.svg?height=40&width=40" },
          deadline: "2023-06-15",
          status: "pending",
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem("tasks", JSON.stringify(sampleTasks))
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      // Sample notifications
      const sampleNotifications = [
        {
          id: "1",
          message: "John Doe assigned you a new task: Implement Homepage",
          read: false,
          date: "2023-05-10T10:30:00",
        },
        {
          id: "2",
          message: 'Project "Website Redesign" deadline is approaching',
          read: true,
          date: "2023-05-08T14:15:00",
        },
        {
          id: "3",
          message: "Bob Johnson completed task: App Wireframes",
          read: false,
          date: "2023-05-07T09:45:00",
        },
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem("notifications", JSON.stringify(sampleNotifications))
    }

    setLoading(false)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("projects", JSON.stringify(projects))
      localStorage.setItem("tasks", JSON.stringify(tasks))
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [projects, tasks, notifications, loading])

  // Project CRUD operations
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      progress: 0,
    }
    setProjects([...projects, newProject])
    return newProject
  }

  const updateProject = (updatedProject) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
  }

  const deleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    // Also delete associated tasks
    setTasks(tasks.filter((t) => t.projectId !== projectId))
  }

  // Task CRUD operations
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      status: "pending",
    }
    setTasks([...tasks, newTask])

    // Update project progress
    updateProjectProgress(task.projectId)

    return newTask
  }

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))

    // Update project progress
    updateProjectProgress(updatedTask.projectId)
  }

  const deleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks(tasks.filter((t) => t.id !== taskId))

    if (task) {
      // Update project progress
      updateProjectProgress(task.projectId)
    }
  }

  // Helper function to update project progress based on tasks
  const updateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId)

    if (projectTasks.length === 0) {
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        updateProject({ ...project, progress: 0 })
      }
      return
    }

    const completedTasks = projectTasks.filter((t) => t.status === "completed").length
    const progress = Math.round((completedTasks / projectTasks.length) * 100)

    const project = projects.find((p) => p.id === projectId)
    if (project) {
      updateProject({ ...project, progress })
    }
  }

  // Notification operations
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      date: new Date().toISOString(),
    }
    setNotifications([newNotification, ...notifications])
    return newNotification
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  // Stats for dashboard
  const getStats = () => {
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "completed").length,
      pendingTasks: tasks.filter((t) => t.status !== "completed").length,
      overallProgress:
        projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
    }
  }

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        notifications,
        loading,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addNotification,
        markNotificationAsRead,
        deleteNotification,
        getStats,
        getProjectTasks: (projectId) => tasks.filter((t) => t.projectId === projectId),
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
