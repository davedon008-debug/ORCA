import express from 'express';
import { getMessagesByRoom } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { chatLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// ─── Authenticated user (STANDARD tier) ────────────────────────────────────────
// GET /api/chat/:room — Get messages by room (30/min — prevent scraping)
router.route('/:room').get(protect, chatLimiter, getMessagesByRoom);

export default router;
