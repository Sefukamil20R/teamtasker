import Task from '../models/Task.model.js';
import Notification from '../models/Notification.model.js';

export const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        if (req.body.assignedTo) {
            await Notification.create({
                user: req.body.assignedTo,
                message: `You have been assigned a new task: ${task.title}`,
            });
        }
        res.status(201).json({ message: 'Task created successfully!', data: task });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the task.', error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find(req.query).populate('assignedTo', 'name email');
        res.status(200).json({ message: 'Tasks retrieved successfully!', data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving tasks.', error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task retrieved successfully!', data: task });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving the task.', error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task updated successfully!', data: task });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the task.', error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the task.', error: error.message });
    }
};