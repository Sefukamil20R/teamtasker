import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';

export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find().populate('teamMembers', 'name email');
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('teamMembers', 'name email');
  res.json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project deleted' });
};

export const getProjectProgress = async (req, res) => {
  const totalTasks = await Task.countDocuments({ project: req.params.id });
  const completedTasks = await Task.countDocuments({ project: req.params.id, status: 'Completed' });

  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  res.json({ progress: progress.toFixed(2) });
};
