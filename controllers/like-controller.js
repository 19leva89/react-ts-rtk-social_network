const { prisma } = require('../prisma/prisma-client');

const LikeController = {
	likePost: async (req, res) => {
		const { postId } = req.body
		if (!postId) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const userId = req.user.userId

		try {
			const existingLike = await prisma.like.findFirst({
				where: {
					postId: postId,
					userId: userId
				}
			})

			if (existingLike) {
				return res.status(400).json({ msg: `Ви вже поставили лайк` })
			}

			const like = await prisma.like.create({
				data: {
					postId: postId,
					userId: userId,
				}
			})

			res.status(200).json(like)
		} catch (error) {
			console.error('Create like error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	unlikePost: async (req, res) => {
		const { id } = req.params
		if (!id) {
			return res.status(400).json({ msg: `Ви вже поставили дізлайк` })
		}

		const userId = req.user.userId

		try {
			const existingLike = await prisma.like.findFirst({
				where: {
					postId: id,
					userId: userId
				}
			})

			if (!existingLike) {
				return res.status(400).json({ msg: `Не можна поставити дізлайк` })
			}

			const like = await prisma.like.deleteMany({
				where: {
					postId: id,
					userId: userId
				},
			})

			res.status(200).json(like)

		} catch (error) {
			console.error('Unlike error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}


module.exports = LikeController;