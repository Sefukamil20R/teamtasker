import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';

export const createProject = async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ message: 'Project created successfully!', data: project });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the project.', error: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('teamMembers', 'name email');
        res.status(200).json({ message: 'Projects retrieved successfully!', data: projects });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving projects.', error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('teamMembers', 'name email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json({ message: 'Project retrieved successfully!', data: project });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving the project.', error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json({ message: 'Project updated successfully!', data: project });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the project.', error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the project.', error: error.message });
    }
};

export const getProjectProgress = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ project: req.params.id });
        const completedTasks = await Task.countDocuments({ project: req.params.id, status: 'Completed' });

        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        res.status(200).json({ message: 'Project progress retrieved successfully!', progress: progress.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving project progress.', error: error.message });
    }
};