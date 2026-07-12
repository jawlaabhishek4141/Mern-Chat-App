const { Router } = require('express');
const { getMessages, createMessage, markRead } = require('../controllers/messages.controller');
const {
  createMessageValidator,
  listMessagesValidator,
  markReadValidator,
} = require('../validators/message.validator');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.use(protect); // every route below requires a valid JWT

router.get('/', listMessagesValidator, validateRequest, getMessages);
router.post('/', createMessageValidator, validateRequest, createMessage);
router.put('/read/:id', markReadValidator, validateRequest, markRead);

module.exports = router;
