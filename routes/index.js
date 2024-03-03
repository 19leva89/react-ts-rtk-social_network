const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { UserController, PostController, CommentController, LikeController, FollowController } = require('../controllers');
const { authenticateToken } = require('../middleware/auth');

const storage = multer.diskStorage({
	destination: 'uploads/',
	filename: function (req, file, cb) {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
		const fileExtension = path.extname(file.originalname);
		const filename = `${uniqueSuffix}${fileExtension}`;
		cb(null, filename)
	}
})

const upload = multer({ storage })

// /api/register
router.post('/register', UserController.register);

// /api/login
router.post('/login', UserController.login);

// /api/users/:id
router.get('/users/:id', authenticateToken, UserController.getUserById);

// /api/users/:id
router.put('/users/:id', authenticateToken, upload.single('avatar'), UserController.update);

// /api/current
router.get('/current', authenticateToken, UserController.current);

// ===========================================================================

// /api/posts
router.post('/posts', authenticateToken, PostController.createPost);

// /api/posts
router.get('/posts', authenticateToken, PostController.getAllPosts);

// /api/posts/:id
router.get('/posts/:id', authenticateToken, PostController.getPostById);

// /api/posts/:id
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

// ===========================================================================

// /api/comments
router.post('/comments', authenticateToken, CommentController.createComment);

// /api/comments/:id
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment);

// ===========================================================================

// /api/likes
router.post('/likes', authenticateToken, LikeController.likePost);

// /api/unlikes/:id
router.delete('/unlikes/:id', authenticateToken, LikeController.unlikePost);

// ===========================================================================

// /api/follows
router.post('/follows', authenticateToken, FollowController.followUser);

// /api/unfollows/:id
router.delete('/unfollows/:id', authenticateToken, FollowController.unfollowUser);

module.exports = router;