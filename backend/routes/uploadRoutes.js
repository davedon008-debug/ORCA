import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Configure storage — temporarily save files to backend/uploads/ before uploading to Cloudinary
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

// @desc    Upload a product image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
// Rate limit: HIGH tier — 10 uploads per hour
router.post('/', protect, admin, uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Ensure Cloudinary is configured (env variables are guaranteed loaded at request time)
  if (process.env.CLOUDINARY_URL) {
    try {
      const url = new URL(process.env.CLOUDINARY_URL);
      cloudinary.config({
        cloud_name: url.hostname,
        api_key: url.username,
        api_secret: url.password,
      });
    } catch (err) {
      console.error('Failed to parse CLOUDINARY_URL:', err);
    }
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  try {
    // Upload the file from local temp storage to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'orca_products',
    });

    // Delete the local temp file to keep the disk clean
    fs.unlinkSync(req.file.path);

    // Return the Cloudinary absolute URL
    res.json({
      url: result.secure_url,
      message: 'Image uploaded successfully to Cloudinary',
    });
  } catch (error) {
    // Clean up local temp file in case of failure
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

export default router;
