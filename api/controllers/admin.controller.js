import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Sales per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Order status breakdown
    const orderStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top products by orders
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.qty' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      stats: { totalOrders, totalProducts, totalUsers, totalRevenue },
      monthlySales,
      orderStatus,
      recentOrders,
      topProducts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};
