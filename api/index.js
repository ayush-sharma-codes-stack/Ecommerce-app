import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './_internal/config/db.js';
import authRoutes from './_internal/routes/auth.routes.js';
import productRoutes from './_internal/routes/product.routes.js';
import cartRoutes from './_internal/routes/cart.routes.js';
import orderRoutes from './_internal/routes/order.routes.js';
import paymentRoutes from './_internal/routes/payment.routes.js';
import adminRoutes from './_internal/routes/admin.routes.js';
import { errorHandler, notFound } from './_internal/middleware/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Stripe webhook needs raw body — mount BEFORE json parser
import paymentWebhook from './_internal/controllers/payment.controller.js';
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhook.stripeWebhook
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins in production, or restrict to your Vercel URL
      callback(null, true);
    },
    credentials: true,
  })
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
}
export default app;
