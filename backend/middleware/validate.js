import { body, param, validationResult } from 'express-validator';

// Middleware to check validation results and return errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }
  next();
};

// --- User validation rules ---

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

// --- Product validation rules ---

const validateProductReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Comment must be under 1000 characters'),
  handleValidationErrors,
];

// --- Order validation rules ---

const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress')
    .isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode')
    .optional({ values: 'falsy' })
    .trim(),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required'),
  body('totalPrice')
    .isFloat({ min: 0 }).withMessage('Total price must be a positive number'),
  handleValidationErrors,
];

// --- Param validation ---

const validateMongoId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

export {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateProductReview,
  validateOrder,
  validateMongoId,
};
