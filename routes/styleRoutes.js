const express = require('express');
const router = express.Router();
const { getStyle, saveStyle } = require('../controllers/styleController');

// GET style for a user
router.get('/:userId', getStyle);

// POST or UPDATE style for a user
router.post('/:userId', saveStyle);

module.exports = router;
