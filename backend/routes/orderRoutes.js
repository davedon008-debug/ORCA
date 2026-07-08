import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderToPaidByAdmin,
  getMyOrders,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { userWriteLimiter, adminWriteLimiter } from '../middleware/rateLimiter.js';
import { validateOrder, validateMongoId } from '../middleware/validate.js';

const router = express.Router();

// ─── Authenticated user (STANDARD tier) ────────────────────────────────────────
// POST /api/orders         — Create order (60/15min)
// GET  /api/orders/myorders — List own orders (no extra limiter, global covers it)
// GET  /api/orders/:id      — View single order
// PUT  /api/orders/:id/pay  — Mark as paid
router.route('/').post(protect, userWriteLimiter, validateOrder, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, validateMongoId, getOrderById);
router.route('/:id/pay').put(protect, userWriteLimiter, validateMongoId, updateOrderToPaid);

// ─── Admin only (HIGH tier) ───────────────────────────────────────────────────
// PUT /api/orders/:id/deliver   — Toggle delivered (30/15min)
// PUT /api/orders/:id/pay-admin — Toggle paid (30/15min)
router.route('/:id/deliver').put(protect, admin, adminWriteLimiter, validateMongoId, updateOrderToDelivered);
router.route('/:id/pay-admin').put(protect, admin, adminWriteLimiter, validateMongoId, updateOrderToPaidByAdmin);

export default router;
