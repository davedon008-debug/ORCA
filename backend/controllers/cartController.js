import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';

// GET USER CART
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [],
    });
  }

  res.json(cart);
});

// SAVE CART
export const saveCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.cartItems = cartItems;
    await cart.save();
  } else {
    cart = await Cart.create({
      user: req.user._id,
      cartItems,
    });
  }

  res.json(cart);
});