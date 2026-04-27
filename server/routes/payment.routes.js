import express from 'express';
import { createCheckoutSession, mockSuccess } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook is mounted in server.js before JSON parser
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/mock-success', protect, mockSuccess);

export default router;
