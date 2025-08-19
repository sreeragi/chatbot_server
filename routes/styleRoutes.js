const express = require('express');
const router = express.Router();
const { saveStyles, getUserStyles } = require('../controllers/styleController');

router.get('/styles', getUserStyles);      // GET /api/styles?userId=1
router.post('/styles', saveStyles);    // POST { userId, styles }

module.exports = router;
