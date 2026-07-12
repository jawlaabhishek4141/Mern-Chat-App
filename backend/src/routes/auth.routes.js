const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validateRequest');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = Router();

// POST /api/auth/login -> dummy username login, returns a JWT
router.post('/login', loginLimiter, loginValidator, validateRequest, login);

module.exports = router;
