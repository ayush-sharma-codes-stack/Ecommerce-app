import express from 'express';
import {
  getCart, addToCart, updateCart, removeFromCart, clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
