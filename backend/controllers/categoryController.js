import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Category from '../models/Category.js';

const seedCategories = [
  // Parents
  { _id: '1', name: 'Accessories', parent: null, description: 'Home decorations and accessories' },
  { _id: '2', name: 'Aquarium', parent: null, description: 'Aquariums and accessories' },
  { _id: '3', name: 'Bedroom', parent: null, description: 'Bedroom furniture' },
  { _id: '4', name: 'Dining Room', parent: null, description: 'Dining sets and kitchen furniture' },
  { _id: '5', name: 'Garden', parent: null, description: 'Garden and outdoor furniture' },
  { _id: '6', name: 'Gym Equipment', parent: null, description: 'Fitness and gym equipment' },
  { _id: '7', name: 'Living Room', parent: null, description: 'Sofas, sideboards, and living furniture' },
  { _id: '8', name: 'Office Furniture', parent: null, description: 'Desks, office chairs, and workspaces' },
  { _id: '9', name: 'Soft Textiles', parent: null, description: 'Bed covers, carpets, curtains, cushions, and duvets' },
  { _id: '10', name: 'Toys', parent: null, description: 'Toys and kids collection' },
  
  // Subcategories of Accessories
  { _id: '11', name: 'Bathroom Accessories', parent: 'Accessories', description: 'Bathroom products' },
  { _id: '12', name: 'Candles', parent: 'Accessories', description: 'Candles and holders' },
  { _id: '13', name: 'Christmas Decoration', parent: 'Accessories', description: 'Holiday decorations' },
  { _id: '14', name: 'Coat Hangers', parent: 'Accessories', description: 'Coat stands and hangers' },
  { _id: '15', name: 'Decorations', parent: 'Accessories', description: 'Table decorations' },
  { _id: '16', name: 'Home Accessories', parent: 'Accessories', description: 'Decorative items' },
  { _id: '17', name: 'Kitchen Items', parent: 'Accessories', description: 'Kitchen organizers' },
  { _id: '18', name: 'Lamps', parent: 'Accessories', description: 'Table lamps and lighting' },
  { _id: '19', name: 'Mirror Sets', parent: 'Accessories', description: 'Wall mirrors' },
  { _id: '20', name: 'Pet Accessories', parent: 'Accessories', description: 'Pet products' },
  { _id: '21', name: 'Self-Care Items', parent: 'Accessories', description: 'Wellness products' },
  { _id: '22', name: 'Stationery', parent: 'Accessories', description: 'Notebooks and papers' },
  { _id: '23', name: 'Tools', parent: 'Accessories', description: 'Household tools' },

  // Subcategories of Bedroom
  { _id: '24', name: 'Bed', parent: 'Bedroom', description: 'Beds and headboards' },
  { _id: '25', name: 'Shoe Cabinet', parent: 'Bedroom', description: 'Shoe cabinets and organizers' },
  { _id: '26', name: 'Wardrobes', parent: 'Bedroom', description: 'Wardrobes and closets' },

  // Subcategories of Dining Room
  { _id: '27', name: 'Bar Tables', parent: 'Dining Room', description: 'High bar tables' },
  { _id: '28', name: 'Bar/Lounge Chairs', parent: 'Dining Room', description: 'Bar stools and chairs' },
  { _id: '29', name: 'Buffet', parent: 'Dining Room', description: 'Sideboards and buffets' },
  { _id: '30', name: 'Dining Chair', parent: 'Dining Room', description: 'Dining chairs' },
  { _id: '31', name: 'Dining Table', parent: 'Dining Room', description: 'Dining tables' },
  { _id: '32', name: 'Display Cabinet', parent: 'Dining Room', description: 'Display and china cabinets' },

  // Subcategories of Garden
  { _id: '33', name: 'Garden Accessories', parent: 'Garden', description: 'Outdoor decorations' },
  { _id: '34', name: 'Garden Chairs', parent: 'Garden', description: 'Outdoor seats' },
  { _id: '35', name: 'Garden Shades', parent: 'Garden', description: 'Parasols and shades' },

  // Subcategories of Living Room
  { _id: '36', name: 'TV Cabinet', parent: 'Living Room', description: 'Media units and TV stands' },
  { _id: '37', name: 'Bookshelves', parent: 'Living Room', description: 'Bookshelves and shelving' },
  { _id: '38', name: 'Coffee Tables', parent: 'Living Room', description: 'Coffee tables' },
  { _id: '39', name: 'Console', parent: 'Living Room', description: 'Console tables' },
  { _id: '40', name: 'Sofa Set', parent: 'Living Room', description: 'Sofas and armchairs' },

  // Subcategories of Soft Textiles
  { _id: '41', name: 'Bed Cover', parent: 'Soft Textiles', description: 'Bed sheets and covers' },
  { _id: '42', name: 'Carpets', parent: 'Soft Textiles', description: 'Area rugs and carpets' },
  { _id: '43', name: 'Curtains', parent: 'Soft Textiles', description: 'Window curtains' },
  { _id: '44', name: 'Cushions', parent: 'Soft Textiles', description: 'Cushions and pillow covers' },
  { _id: '45', name: 'Duvet', parent: 'Soft Textiles', description: 'Duvets and blankets' },
  { _id: '46', name: 'Table Cloth', parent: 'Soft Textiles', description: 'Table covers and cloths' }
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(seedCategories);
    }
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error('Database query failed, returning fallback categories:', error);
    res.json(seedCategories);
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, image, description } = req.body;
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name, image, description });
  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export { getCategories, createCategory, deleteCategory };
