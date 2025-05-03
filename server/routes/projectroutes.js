import express from 'express';
import { protect } from '../middlewares/auth.Middleware.js';
import { createProject, getProjects, getProjectById, updateProject, deleteProject, getProjectProgress } from '../controllers/project.Controllers.js';

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, getProjects);
router.get('/:id/progress', protect, getProjectProgress);

router.route('/:id').get(protect, getProjectById).put(protect, updateProject).delete(protect, deleteProject);

export default router;
