import express from 'express';
import { getCart, saveCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { userWriteLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// ─── Authenticated user (STANDARD tier) ────────────────────────────────────────
// GET  /api/cart — Get cart (global limiter covers reads)
// POST /api/cart — Save/update cart (60/15min)
router.get('/', protect, getCart);
router.post('/', protect, userWriteLimiter, saveCart);

export default router;