import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

// @desc    Create order
// @route   POST /api/orders/create
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'stripe' } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    // Check stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.qty)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
    }

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      totalAmount: cart.totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order by id
// @route   GET /api/orders/:id
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark order as delivered (admin)
// @route   PUT /api/orders/:id/deliver
export const markDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
