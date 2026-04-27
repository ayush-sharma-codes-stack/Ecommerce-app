import express from 'express';
import {
  createOrder, getMyOrders, getOrder, getAllOrders, markDelivered,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/create', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.get('/', restrictTo('admin'), getAllOrders);
router.put('/:id/deliver', restrictTo('admin'), markDelivered);

export default router;
