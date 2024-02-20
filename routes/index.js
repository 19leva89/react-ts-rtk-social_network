const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController } = require('../controllers');

const uploadDestination = 'uploads'

const storage = multer.diskStorage({
	destination: uploadDestination,
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const uploads = multer({ storage: storage })

// /api/register
router.post('/register', UserController.register);

// /api/login
router.post('/login', UserController.login);

// /api/users/:id
router.get('/users/:id', UserController.getUserById);

// /api/users/:id
router.put('/users/:id', UserController.update);

// /api/current
router.get('/current', UserController.current);

module.exports = router;