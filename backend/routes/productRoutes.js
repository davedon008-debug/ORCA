import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { searchLimiter, publicReadLimiter, adminWriteLimiter, userWriteLimiter } from '../middleware/rateLimiter.js';
import { validateProductReview, validateMongoId } from '../middleware/validate.js';

const router = express.Router();

// ─── Public (RELAXED tier) ─────────────────────────────────────────────────────
// GET /api/products      — Search/list  (100/min)
// GET /api/products/:id  — Detail view  (120/min)
router.route('/').get(searchLimiter, getProducts).post(protect, admin, adminWriteLimiter, createProduct);
router
  .route('/:id')
  .get(publicReadLimiter, validateMongoId, getProductById)
  .put(protect, admin, adminWriteLimiter, validateMongoId, updateProduct)
  .delete(protect, admin, adminWriteLimiter, validateMongoId, deleteProduct);

// ─── Authenticated (STANDARD tier) ────────────────────────────────────────────
// POST /api/products/:id/reviews — Submit review (60/15min)
router.route('/:id/reviews').post(protect, userWriteLimiter, validateMongoId, validateProductReview, createProductReview);

export default router;
