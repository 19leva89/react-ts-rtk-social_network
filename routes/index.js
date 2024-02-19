const express = require('express');
const router = express.Router();

// /api/register
router.get('/register', (req, res) => {
	res.send('register ОК')
});

module.exports = router;