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

    const seedCategories = [
      // Parents
      { name: 'Accessories', parent: null, description: 'Home decorations and accessories' },
      { name: 'Aquarium', parent: null, description: 'Aquariums and accessories' },
      { name: 'Bedroom', parent: null, description: 'Bedroom furniture' },
      { name: 'Dining Room', parent: null, description: 'Dining sets and kitchen furniture' },
      { name: 'Garden', parent: null, description: 'Garden and outdoor furniture' },
      { name: 'Gym Equipment', parent: null, description: 'Fitness and gym equipment' },
      { name: 'Living Room', parent: null, description: 'Sofas, sideboards, and living furniture' },
      { name: 'Office Furniture', parent: null, description: 'Desks, office chairs, and workspaces' },
      { name: 'Soft Textiles', parent: null, description: 'Bed covers, carpets, curtains, cushions, and duvets' },
      { name: 'Toys', parent: null, description: 'Toys and kids collection' },
      
      // Subcategories of Accessories
      { name: 'Bathroom Accessories', parent: 'Accessories', description: 'Bathroom products' },
      { name: 'Candles', parent: 'Accessories', description: 'Candles and holders' },
      { name: 'Christmas Decoration', parent: 'Accessories', description: 'Holiday decorations' },
      { name: 'Coat Hangers', parent: 'Accessories', description: 'Coat stands and hangers' },
      { name: 'Decorations', parent: 'Accessories', description: 'Table decorations' },
      { name: 'Home Accessories', parent: 'Accessories', description: 'Decorative items' },
      { name: 'Kitchen Items', parent: 'Accessories', description: 'Kitchen organizers' },
      { name: 'Lamps', parent: 'Accessories', description: 'Table lamps and lighting' },
      { name: 'Mirror Sets', parent: 'Accessories', description: 'Wall mirrors' },
      { name: 'Pet Accessories', parent: 'Accessories', description: 'Pet products' },
      { name: 'Self-Care Items', parent: 'Accessories', description: 'Wellness products' },
      { name: 'Stationery', parent: 'Accessories', description: 'Notebooks and papers' },
      { name: 'Tools', parent: 'Accessories', description: 'Household tools' },

      // Subcategories of Bedroom
      { name: 'Bed', parent: 'Bedroom', description: 'Beds and headboards' },
      { name: 'Shoe Cabinet', parent: 'Bedroom', description: 'Shoe cabinets and organizers' },
      { name: 'Wardrobes', parent: 'Bedroom', description: 'Wardrobes and closets' },

      // Subcategories of Dining Room
      { name: 'Bar Tables', parent: 'Dining Room', description: 'High bar tables' },
      { name: 'Bar/Lounge Chairs', parent: 'Dining Room', description: 'Bar stools and chairs' },
      { name: 'Buffet', parent: 'Dining Room', description: 'Sideboards and buffets' },
      { name: 'Dining Chair', parent: 'Dining Room', description: 'Dining chairs' },
      { name: 'Dining Table', parent: 'Dining Room', description: 'Dining tables' },
      { name: 'Display Cabinet', parent: 'Dining Room', description: 'Display and china cabinets' },

      // Subcategories of Garden
      { name: 'Garden Accessories', parent: 'Garden', description: 'Outdoor decorations' },
      { name: 'Garden Chairs', parent: 'Garden', description: 'Outdoor seats' },
      { name: 'Garden Shades', parent: 'Garden', description: 'Parasols and shades' },

      // Subcategories of Living Room
      { name: 'TV Cabinet', parent: 'Living Room', description: 'Media units and TV stands' },
      { name: 'Bookshelves', parent: 'Living Room', description: 'Bookshelves and shelving' },
      { name: 'Coffee Tables', parent: 'Living Room', description: 'Coffee tables' },
      { name: 'Console', parent: 'Living Room', description: 'Console tables' },
      { name: 'Sofa Set', parent: 'Living Room', description: 'Sofas and armchairs' },

      // Subcategories of Soft Textiles
      { name: 'Bed Cover', parent: 'Soft Textiles', description: 'Bed sheets and covers' },
      { name: 'Carpets', parent: 'Soft Textiles', description: 'Area rugs and carpets' },
      { name: 'Curtains', parent: 'Soft Textiles', description: 'Window curtains' },
      { name: 'Cushions', parent: 'Soft Textiles', description: 'Cushions and pillow covers' },
      { name: 'Duvet', parent: 'Soft Textiles', description: 'Duvets and blankets' },
      { name: 'Table Cloth', parent: 'Soft Textiles', description: 'Table covers and cloths' }
    ];

    await Category.insertMany(seedCategories);

    const sampleProducts = products.map((p, index) => {
      // Map sample products to some of the new categories
      const categoryName = index < 2 ? 'Sofa Set' : 
                           index < 4 ? 'Bed' : 
                           index < 6 ? 'Office Furniture' : 
                           index < 8 ? 'Dining Table' : 
                           index < 10 ? 'Gym Equipment' : 
                           index < 12 ? 'Bathroom Accessories' : 
                           index < 14 ? 'Lamps' : 
                           index < 16 ? 'Garden Chairs' : 'Carpets';
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
