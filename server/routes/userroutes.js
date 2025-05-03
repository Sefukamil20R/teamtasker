import express from 'express';
import { protect } from '../middlewares/auth.Middleware.js';
import { authorizeRoles } from '../middlewares/role.Middleware.js';
import { getAllUsers } from '../controllers/user.Controllers.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getAllUsers);

export default router;