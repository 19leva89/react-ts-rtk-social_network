const { prisma } = require('../prisma/prisma-client');

const PostController = {
	createPost: async (req, res) => {
		const { content } = req.body
		if (!content) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const authorId = req.user.userId

		try {
			const post = await prisma.post.create({
				data: {
					content: content,
					authorId: authorId,
				}
			})

			res.status(200).json(post)

		} catch (error) {
			console.error('Create post error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}

	},

	getAllPosts: async (req, res) => {
		const userId = req.user.userId

		try {
			const posts = await prisma.post.findMany({
				include: {
					likes: true,
					author: true,
					comments: true,
				},
				orderBy: {
					createdAt: 'desc'
				}
			})

			const postWithLikeInfo = posts.map(post => ({
				...post,
				likedByUser: post.likes.some(like => like.userId === userId)
			}))

			res.status(200).json(postWithLikeInfo)

		} catch (error) {
			console.error('Get all posts error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	getPostById: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const post = await prisma.post.findUnique({
				where: {
					id: id
				},
				include: {
					comments: {
						include: {
							user: true
						}
					},
					likes: true,
					author: true,
				}
			})

			if (!post) {
				return res.status(404).json({ msg: `Пост не знайдено` });
			}

			const postWithLikeInfo = {
				...post,
				likedByUser: post.likes.some(like => like.userId === userId)
			}

			res.status(200).json(postWithLikeInfo)

		} catch (error) {
			console.error('Get post by Id error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	deletePost: async (req, res) => {
		const { id } = req.params

		const post = await prisma.post.findUnique({
			where: {
				id: id
			},
		})

		if (!post) {
			return res.status(404).json({ msg: `Пост не знайдено` });
		}

		if (post.authorId !== req.user.userId) {
			return res.status(403).json({ msg: `Немає доступу` });
		}

		try {
			const transaction = await prisma.$transaction([
				prisma.comment.deleteMany({ where: { postId: id } }),
				prisma.like.deleteMany({ where: { postId: id } }),
				prisma.post.delete({ where: { id: id } }),
			])

			res.status(200).json(transaction)

		} catch (error) {
			console.error('Delete post error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}

module.exports = PostController;