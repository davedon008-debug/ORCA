import rateLimit from 'express-rate-limit';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Enterprise Rate Limiting Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Architecture:
//   - Factory function `createLimiter()` produces named, configurable limiters
//   - Default store: in-memory (express-rate-limit built-in MemoryStore)
//   - Redis-ready: swap `store` option to `rate-limit-redis` for distributed
//   - Every limiter logs violations with IP, path, method, and limiter name
//   - Structured JSON error responses with retry-after and RFC headers
//
// Risk tiers:
//   CRITICAL  — credential-based endpoints (login, register, password reset)
//   HIGH      — sensitive mutations (file upload, admin actions)
//   STANDARD  — authenticated read/write (cart, wishlist, orders, chat)
//   RELAXED   — public read-only endpoints (product search, categories)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Resolve the real client IP, accounting for reverse proxies.
 * Falls back to req.ip (Express default).
 */
const resolveClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
};

/**
 * Factory: create a named rate limiter with structured error responses
 * and automatic violation logging.
 *
 * @param {Object} options
 * @param {string}  options.name        — Human-readable limiter name for logs
 * @param {number}  options.windowMs    — Time window in milliseconds
 * @param {number}  options.max         — Max requests in window
 * @param {string}  options.tier        — Risk tier label (CRITICAL | HIGH | STANDARD | RELAXED)
 * @param {string}  [options.message]   — Custom user-facing message
 * @param {boolean} [options.skipSuccessfulRequests] — Don't count successful requests
 * @param {boolean} [options.skipFailedRequests]     — Don't count failed requests
 * @param {Function} [options.keyGenerator]          — Custom key generator
 * @returns {Function} Express middleware
 */
const createLimiter = ({
  name,
  windowMs,
  max,
  tier,
  message,
  skipSuccessfulRequests = false,
  skipFailedRequests = false,
  keyGenerator,
}) => {
  const windowMinutes = Math.round(windowMs / 60000);
  const defaultMessage = `Rate limit exceeded. Maximum ${max} requests per ${windowMinutes} minute(s). Please try again later.`;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return `RateLimit-*` headers (draft-6)
    legacyHeaders: false,    // Disable deprecated `X-RateLimit-*` headers
    skipSuccessfulRequests,
    skipFailedRequests,

    // ── Key generator ──────────────────────────────────────────────────────
    // Uses real client IP. Override with `keyGenerator` option for
    // per-user limiting on authenticated routes.
    keyGenerator: keyGenerator || ((req) => resolveClientIp(req)),

    // ── Store ──────────────────────────────────────────────────────────────
    // Default: in-memory MemoryStore (single-process).
    // For production with multiple instances, swap to Redis:
    //
    //   import { RedisStore } from 'rate-limit-redis';
    //   import RedisClient from 'ioredis';
    //   const redis = new RedisClient(process.env.REDIS_URL);
    //   store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),

    // ── Violation handler ──────────────────────────────────────────────────
    handler: (req, res, next, options) => {
      const ip = resolveClientIp(req);
      const retryAfterSeconds = Math.ceil(windowMs / 1000);

      // Log violation for monitoring / SIEM ingestion
      console.warn(JSON.stringify({
        level: 'WARN',
        event: 'RATE_LIMIT_EXCEEDED',
        limiter: name,
        tier,
        ip,
        method: req.method,
        path: req.originalUrl,
        userAgent: req.headers['user-agent'] || 'unknown',
        timestamp: new Date().toISOString(),
        limit: max,
        windowMinutes,
      }));

      res.status(429).json({
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: message || defaultMessage,
        limiter: name,
        tier,
        retryAfter: retryAfterSeconds,
        limit: max,
        windowMinutes,
      });
    },
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIER: CRITICAL — Credential / identity endpoints
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Login: 5 attempts per 15 minutes */
const loginLimiter = createLimiter({
  name: 'login',
  tier: 'CRITICAL',
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Your account is temporarily locked for 15 minutes.',
  skipSuccessfulRequests: true, // Only count failed attempts (brute-force focus)
});

/** Registration: 5 attempts per hour */
const registerLimiter = createLimiter({
  name: 'register',
  tier: 'CRITICAL',
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please try again in 1 hour.',
});

/** Password reset: 3 attempts per hour */
const passwordResetLimiter = createLimiter({
  name: 'password-reset',
  tier: 'CRITICAL',
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password reset requests. Please try again in 1 hour.',
});

/** OTP verification: 5 attempts per 10 minutes */
const otpLimiter = createLimiter({
  name: 'otp-verification',
  tier: 'CRITICAL',
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many verification attempts. Please try again in 10 minutes.',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIER: HIGH — Admin actions, file uploads, sensitive mutations
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Admin-only write operations: 30 requests per 15 minutes */
const adminWriteLimiter = createLimiter({
  name: 'admin-write',
  tier: 'HIGH',
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Admin action rate limit exceeded. Please slow down.',
});

/** File uploads: 10 per hour */
const uploadLimiter = createLimiter({
  name: 'file-upload',
  tier: 'HIGH',
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Upload limit reached. Maximum 10 uploads per hour.',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIER: STANDARD — Authenticated read/write (cart, wishlist, orders, chat)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Authenticated user write operations: 60 requests per 15 minutes */
const userWriteLimiter = createLimiter({
  name: 'user-write',
  tier: 'STANDARD',
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many write requests. Please slow down.',
});

/** Chat messages: 30 per minute (prevent spam) */
const chatLimiter = createLimiter({
  name: 'chat',
  tier: 'STANDARD',
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Sending messages too fast. Please slow down.',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIER: RELAXED — Public read-only endpoints
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Product search / listing: 100 requests per minute */
const searchLimiter = createLimiter({
  name: 'product-search',
  tier: 'RELAXED',
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many search requests. Please wait a moment.',
});

/** Public reads (categories, product detail): 120 requests per minute */
const publicReadLimiter = createLimiter({
  name: 'public-read',
  tier: 'RELAXED',
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: 'Too many requests. Please wait a moment.',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL — Catch-all safety net for any /api route
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Global API limiter: 100 requests per minute per IP */
const globalApiLimiter = createLimiter({
  name: 'global-api',
  tier: 'GLOBAL',
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again shortly.',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  createLimiter,          // Factory for custom limiters
  // CRITICAL tier
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  otpLimiter,
  // HIGH tier
  adminWriteLimiter,
  uploadLimiter,
  // STANDARD tier
  userWriteLimiter,
  chatLimiter,
  // RELAXED tier
  searchLimiter,
  publicReadLimiter,
  // GLOBAL
  globalApiLimiter,
};
