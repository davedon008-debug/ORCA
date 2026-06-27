import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json(wishlist);
});

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  res.status(200).json(await wishlist.populate('products'));
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    res.json(await wishlist.populate('products'));
  } else {
    res.status(404);
    throw new Error('Wishlist not found');
  }
});

export { getWishlist, addToWishlist, removeFromWishlist };
