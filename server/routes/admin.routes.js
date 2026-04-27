import express from 'express';
import { getDashboardStats, getAllUsers } from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

export default router;
