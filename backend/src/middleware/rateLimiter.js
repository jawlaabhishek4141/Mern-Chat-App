const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/** General API limiter - generous, just guards against abuse/loops. */
const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests - please slow down and try again shortly.' },
});

/** Tighter limiter specifically for login, to slow down username enumeration. */
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts - please try again in a few minutes.' },
});

module.exports = { apiLimiter, loginLimiter };
