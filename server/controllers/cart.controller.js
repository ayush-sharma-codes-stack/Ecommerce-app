import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const calcAndSave = async (cart) => {
  cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  return await cart.save();
};

// @desc    Get cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');
    if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Add to cart
// @route   POST /api/cart/add
export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < qty)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      cart.items.push({
        product: product._id,
        qty,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        name: product.name,
        image: product.images[0] || '',
      });
    }

    await calcAndSave(cart);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item qty
// @route   PUT /api/cart/update
export const updateCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.qty = qty;
    }

    await calcAndSave(cart);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await calcAndSave(cart);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};
