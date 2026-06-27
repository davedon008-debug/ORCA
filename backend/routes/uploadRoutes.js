import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Configure storage — save files to backend/uploads/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Only allow image file types
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp|gif|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// @desc    Upload a product image
// @route   POST /api/upload
// @access  Private/Admin
// Rate limit: HIGH tier — 10 uploads per hour
router.post('/', protect, admin, uploadLimiter, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the URL path the frontend can use
  res.json({
    url: `/uploads/${req.file.filename}`,
    message: 'Image uploaded successfully',
  });
});

export default router;
