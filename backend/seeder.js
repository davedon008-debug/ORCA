import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Only clear products and categories — preserve user accounts
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    // Use existing admin user if available, otherwise create seed users
    let adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      const createdUsers = await User.insertMany(users);
      adminUser = createdUsers[0];
    }

    const categories = ['Living Room', 'Kitchen', 'Bedroom', 'Office'];
    await Category.insertMany(categories.map(c => ({ name: c, description: `${c} Furniture` })));

    const sampleProducts = products.map((p, index) => {
      const categoryName = index < 5 ? 'Living Room' : index < 10 ? 'Kitchen' : index < 15 ? 'Bedroom' : 'Office';
      return { ...p, user: adminUser._id, category: categoryName };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seed: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
