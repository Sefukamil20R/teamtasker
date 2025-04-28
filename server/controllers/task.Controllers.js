import Task from '../models/Task.model.js';
import Notification from '../models/Notification.model.js';

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  if (req.body.assignedTo) {
    await Notification.create({
      user: req.body.assignedTo,
      message: `You have been assigned a new task: ${task.title}`,
    });
  }
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find(req.query).populate('assignedTo', 'name email');
  res.json(tasks);
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
