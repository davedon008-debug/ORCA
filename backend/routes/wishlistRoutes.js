import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import { userWriteLimiter } from '../middleware/rateLimiter.js';
import { validateMongoId } from '../middleware/validate.js';

const router = express.Router();

// ─── Authenticated user (STANDARD tier) ────────────────────────────────────────
// GET    /api/wishlist     — Get wishlist (global limiter covers reads)
// POST   /api/wishlist     — Add item (60/15min)
// DELETE /api/wishlist/:id — Remove item (60/15min)
router.route('/').get(protect, getWishlist).post(protect, userWriteLimiter, addToWishlist);
router.route('/:id').delete(protect, userWriteLimiter, validateMongoId, removeFromWishlist);

export default router;
