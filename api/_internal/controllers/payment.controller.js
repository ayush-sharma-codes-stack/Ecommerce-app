import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

let stripeInstance;
const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image && item.image.startsWith('http') ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Detect client URL robustly
    let clientUrl = process.env.CLIENT_URL;
    if (!clientUrl || clientUrl.includes('localhost')) {
      const origin = req.get('origin') || req.get('referer');
      if (origin) {
        clientUrl = new URL(origin).origin;
      }
    }
    if (!clientUrl) clientUrl = 'http://localhost:5173'; // Fallback

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.user.email,
      line_items: lineItems,
      metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
      success_url: `${clientUrl}/orders/${order._id}?success=true`,
      cancel_url: `${clientUrl}/checkout?cancelled=true`,
    });

    // Save session id
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe Session Error:', err.message);
    next(err);
  }
};


// @desc    Stripe webhook
// @route   POST /api/payment/webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const stripe = getStripe();

  try {
    if (process.env.NODE_ENV === 'development' && (!sig || process.env.STRIPE_WEBHOOK_SECRET === 'whsec_your_webhook_secret')) {
      // In dev mode, if secret is not set, we skip signature verification and use the body directly
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findById(session.metadata.orderId).populate('user', 'name email');

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.stripePaymentId = session.payment_intent;
      await order.save();

      // Reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
      }

      // Clear cart
      await Cart.findOneAndDelete({ user: order.user._id });

      // Send confirmation email
      sendOrderConfirmationEmail({
        email: order.user.email,
        name: order.user.name,
        order,
      }).catch(console.error);
    }
  }

  res.json({ received: true });
};

// @desc    Mock payment success (DEV ONLY)
// @route   POST /api/payment/mock-success
export const mockSuccess = async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not available in production' });
  
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'name email');
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: order.user._id });

    res.json({ success: true, message: 'Mock payment successful', order });
  } catch (err) {
    next(err);
  }
};

export default { createCheckoutSession, stripeWebhook, mockSuccess };
