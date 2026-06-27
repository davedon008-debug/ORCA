import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { publicReadLimiter, adminWriteLimiter } from '../middleware/rateLimiter.js';
import { validateMongoId } from '../middleware/validate.js';

const router = express.Router();

// ─── Public (RELAXED tier) ─────────────────────────────────────────────────────
// GET /api/categories — List all categories (120/min)
router.route('/').get(publicReadLimiter, getCategories).post(protect, admin, adminWriteLimiter, createCategory);

// ─── Admin only (HIGH tier) ───────────────────────────────────────────────────
// DELETE /api/categories/:id — Remove category (30/15min)
router.route('/:id').delete(protect, admin, adminWriteLimiter, validateMongoId, deleteCategory);

export default router;
