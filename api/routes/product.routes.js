import express from 'express';
import {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, createReview,
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, restrictTo('admin'), upload.array('images', 5), createProduct);
router.put('/:id', protect, restrictTo('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);
router.post('/:id/reviews', protect, createReview);

export default router;
