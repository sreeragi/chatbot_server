const express = require('express');
const router = express.Router();
const { chatOnce } = require('../controllers/chatController');

router.post('/chat', chatOnce);  // POST /api/chat

module.exports = router;
