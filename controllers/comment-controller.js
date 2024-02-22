const { prisma } = require('../prisma/prisma-client');

const CommentController = {
	createComment: async (req, res) => {
		const { postId, content } = req.body
		if (!postId || !content) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const userId = req.user.userId

		try {
			const comment = await prisma.comment.create({
				data: {
					postId: postId,
					userId: userId,
					content: content,
				}
			})

			res.status(200).json(comment)
		} catch (error) {
			console.error('Create comment error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	deleteComment: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const comment = await prisma.comment.findUnique({
				where: {
					id: id
				},
			})

			if (!comment) {
				return res.status(404).json({ msg: `Коментар не знайдено` });
			}

			if (comment.userId !== userId) {
				return res.status(403).json({ msg: `Немає доступу` });
			}

			await prisma.comment.delete({
				where: {
					id: id
				},
			})

			res.status(200).json(comment)

		} catch (error) {
			console.error('Delete comment error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}

module.exports = CommentController;