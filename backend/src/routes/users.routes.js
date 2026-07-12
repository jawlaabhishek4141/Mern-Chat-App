const { Router } = require('express');
const { getOnlineUsers } = require('../controllers/users.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.get('/online', protect, getOnlineUsers);

module.exports = router;
