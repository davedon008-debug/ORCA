import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Search keyword — searches across name, brand, category & description
  const keyword = req.query.keyword ? {
    $or: [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } },
      { category: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
    ],
  } : {};

  // Filtering
  const category = req.query.category && req.query.category !== 'all' ? { category: req.query.category } : {};
  const brand = req.query.brand && req.query.brand !== 'all' ? { brand: req.query.brand } : {};
  const color = req.query.color && req.query.color !== 'all' ? { color: req.query.color } : {};
  const rating = req.query.rating && req.query.rating !== 'all' ? { rating: { $gte: Number(req.query.rating) } } : {};
  const price = (req.query.minPrice || req.query.maxPrice) ? {
    price: {
      $gte: Number(req.query.minPrice) || 0,
      $lte: Number(req.query.maxPrice) || 1000000,
    }
  } : {};
  const inStock = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

  // Find all filters combined — use $and so the keyword $or doesn't clash with other field filters
  const otherFilters = { ...category, ...brand, ...color, ...rating, ...price, ...inStock };
  const hasKeyword = req.query.keyword && req.query.keyword.trim() !== '';
  const hasOtherFilters = Object.keys(otherFilters).length > 0;

  let filter = {};
  if (hasKeyword && hasOtherFilters) {
    filter = { $and: [keyword, otherFilters] };
  } else if (hasKeyword) {
    filter = keyword;
  } else {
    filter = otherFilters;
  }

  // Sorting
  let sortOption = {};
  switch (req.query.sort) {
    case 'lowest': sortOption = { price: 1 }; break;
    case 'highest': sortOption = { price: -1 }; break;
    case 'popular': sortOption = { numReviews: -1 }; break;
    case 'newest':
    default: sortOption = { createdAt: -1 }; break;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: ['/images/sample.jpg'],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    color: 'Sample color'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, brand, category, countInStock, color, isFeatured, isNewArrival, specifications } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.color = color || product.color;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
    
    if (specifications) {
      product.specifications = specifications;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
