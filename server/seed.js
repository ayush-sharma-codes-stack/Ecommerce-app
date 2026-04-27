import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys'];

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with 30-hour battery life, crystal clear hands-free calling, and Alexa voice control.',
    price: 399.99, discountPrice: 329.99, stock: 45, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'],
    ratings: 4.8, numReviews: 128,
  },
  {
    name: 'Apple MacBook Air M3',
    description: 'Supercharged by M3 chip, incredibly thin design, all-day battery life, and brilliant Liquid Retina display.',
    price: 1299.99, discountPrice: 1199.99, stock: 20, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    ratings: 4.9, numReviews: 256,
  },
  {
    name: 'Samsung 65" QLED 4K TV',
    description: 'Quantum Dot technology produces over a billion colors. Real depth and detail in every scene.',
    price: 1499.99, discountPrice: 1299.99, stock: 15, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'],
    ratings: 4.7, numReviews: 89,
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers unrivaled comfort with the tallest Air unit yet for lightweight cushioning.',
    price: 150.00, discountPrice: 119.99, stock: 80, category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    ratings: 4.6, numReviews: 312,
  },
  {
    name: 'Levi\'s 511 Slim Jeans',
    description: 'Classic slim fit jeans made from premium stretch denim for all-day comfort and style.',
    price: 79.99, discountPrice: 59.99, stock: 120, category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    ratings: 4.4, numReviews: 445,
  },
  {
    name: 'Atomic Habits - James Clear',
    description: 'The #1 New York Times bestseller. Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits.',
    price: 27.99, discountPrice: 18.99, stock: 200, category: 'Books',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
    ratings: 4.9, numReviews: 1024,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 24.99, discountPrice: 16.99, stock: 180, category: 'Books',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800'],
    ratings: 4.8, numReviews: 756,
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser detects invisible dust. Automatically adapts suction power to remove dust and dirt.',
    price: 749.99, discountPrice: 649.99, stock: 25, category: 'Home',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    ratings: 4.7, numReviews: 178,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer in one.',
    price: 99.99, discountPrice: 79.99, stock: 60, category: 'Home',
    images: ['https://images.unsplash.com/photo-1585837146751-a4b0051ec8a0?w=800'],
    ratings: 4.6, numReviews: 892,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material.',
    price: 49.99, discountPrice: 39.99, stock: 90, category: 'Sports',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
    ratings: 4.5, numReviews: 234,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick-change dial system.',
    price: 299.99, discountPrice: 249.99, stock: 30, category: 'Sports',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
    ratings: 4.7, numReviews: 167,
  },
  {
    name: 'CeraVe Moisturizing Cream',
    description: 'Developed with dermatologists. Contains ceramides, hyaluronic acid, MVE technology for 24-hour hydration.',
    price: 19.99, discountPrice: 14.99, stock: 150, category: 'Beauty',
    images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800'],
    ratings: 4.8, numReviews: 2048,
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Build the iconic Millennium Falcon from Star Wars. 7,541 pieces for the ultimate building challenge.',
    price: 849.99, discountPrice: 749.99, stock: 12, category: 'Toys',
    images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800'],
    ratings: 4.9, numReviews: 345,
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 48MP camera system, and Dynamic Island.',
    price: 1199.99, discountPrice: 1099.99, stock: 35, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
    ratings: 4.8, numReviews: 512,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Responsive running shoes with BOOST cushioning and Primeknit+ upper for ultimate comfort.',
    price: 189.99, discountPrice: 149.99, stock: 70, category: 'Clothing',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'],
    ratings: 4.6, numReviews: 289,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user from .env
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.EMAIL_USER || 'admin@shopelite.com',
      password: process.env.EMAIL_PASS || 'Admin@123',
      role: 'admin',
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@shopelite.com',
      password: 'User@123',
      role: 'user',
    });
    console.log(`✅ Sample user created: ${user.email}`);

    // Create products
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Admin:  ${admin.email} / ${process.env.EMAIL_PASS || 'Admin@123'}`);
    console.log(`User:   user@shopelite.com / User@123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
