import Notification from '../models/Notification.model.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  res.json(notifications);
};

export const createNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(notification);
};

export const deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
};
