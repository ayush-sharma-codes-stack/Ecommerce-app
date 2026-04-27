import Product from '../models/Product.js';
import { cloudinary } from '../utils/cloudinary.js';

// @desc    Get all products (search, filter, sort, paginate)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword, category, minPrice, maxPrice, minRating,
      sortBy = 'createdAt', order = 'desc',
      page = 1, limit = 12,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.ratings = { $gte: Number(minRating) };

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, stock, category } = req.body;
    const images = req.files ? req.files.map((f) => f.path) : (req.body.images ? JSON.parse(req.body.images) : []);

    const product = await Product.create({
      name, description, price, discountPrice, stock, category, images,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, description, price, discountPrice, stock, category, existingImages } = req.body;
    const newImages = req.files ? req.files.map((f) => f.path) : [];

    // Parse existing images if provided (sent as JSON string from frontend)
    let finalExisting = product.images;
    if (existingImages) {
      const parsedExisting = JSON.parse(existingImages);
      
      // Identify removed images to delete from Cloudinary
      const removedImages = product.images.filter(img => !parsedExisting.includes(img));
      for (const img of removedImages) {
        const publicId = img.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      finalExisting = parsedExisting;
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.images = [...finalExisting, ...newImages];

    const updated = await product.save();
    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Delete images from Cloudinary
    for (const img of product.images) {
      const publicId = img.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/products/:id/reviews
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ success: false, message: 'Product already reviewed' });

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (err) {
    next(err);
  }
};
