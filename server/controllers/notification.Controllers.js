import Notification from '../models/Notification.model.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id });
        res.status(200).json({ message: 'Notifications retrieved successfully!', data: notifications });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving notifications.', error: error.message });
    }
};

export const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ message: 'Notification created successfully!', data: notification });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the notification.', error: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        res.status(200).json({ message: 'Notification marked as read.', data: notification });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the notification.', error: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }
        res.status(200).json({ message: 'Notification deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the notification.', error: error.message });
    }
};