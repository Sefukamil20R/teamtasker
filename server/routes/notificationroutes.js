import express from 'express';
import { protect } from '../middlewares/auth.Middleware.js';
import { getNotifications, createNotification, markNotificationRead, deleteNotification } from '../controllers/notification.Controllers.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.put('/:id/read', protect, markNotificationRead);
router.delete('/:id', protect, deleteNotification);

export default router;
