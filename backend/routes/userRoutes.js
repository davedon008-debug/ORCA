import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  authGoogleUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { loginLimiter, registerLimiter, adminWriteLimiter, userWriteLimiter } from '../middleware/rateLimiter.js';
import { validateRegister, validateLogin, validateUpdateProfile, validateMongoId } from '../middleware/validate.js';

const router = express.Router();

// ─── Public ────────────────────────────────────────────────────────────────────
// POST /api/users        — Register (CRITICAL: 5/hour)
// POST /api/users/login  — Login    (CRITICAL: 5/15min, only counts failures)
// POST /api/users/google — Google login/registration
router.route('/').post(registerLimiter, validateRegister, registerUser).get(protect, admin, getUsers);
router.post('/login', loginLimiter, validateLogin, authUser);
router.post('/google', loginLimiter, authGoogleUser);

// ─── Authenticated user ────────────────────────────────────────────────────────
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, userWriteLimiter, validateUpdateProfile, updateUserProfile);

// ─── Admin only ────────────────────────────────────────────────────────────────
router
  .route('/:id')
  .delete(protect, admin, adminWriteLimiter, validateMongoId, deleteUser)
  .get(protect, admin, validateMongoId, getUserById)
  .put(protect, admin, adminWriteLimiter, validateMongoId, updateUser);

export default router;
