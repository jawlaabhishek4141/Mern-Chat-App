const { Router } = require('express');
const authRoutes = require('./auth.routes');
const messagesRoutes = require('./messages.routes');
const usersRoutes = require('./users.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/messages', messagesRoutes);
router.use('/users', usersRoutes);

module.exports = router;
