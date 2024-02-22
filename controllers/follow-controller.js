const { prisma } = require('../prisma/prisma-client');

const FollowController = {
	followUser: async (req, res) => {
		const { followingId } = req.body
		const userId = req.user.userId
		if (followingId === userId) {
			return res.status(500).json({ msg: `Ви не можете підписатися на самого себе` })
		}

		try {
			const existingFollow = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId: followingId }
					]
				}
			})

			if (existingFollow) {
				return res.status(400).json({ msg: `Підписка вже існує` })
			}

			await prisma.follows.create({
				data: {
					follower: { connect: { id: userId } },
					following: { connect: { id: followingId } },
				}
			})

			res.status(201).json({ msg: `Підписка успішно створена` })
		} catch (error) {
			console.error('Create follow error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	unfollowUser: async (req, res) => {
		const { followingId } = req.params
		const userId = req.user.userId

		try {
			const existingFollows = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId: followingId }
					]
				}
			})

			if (!existingFollows) {
				return res.status(404).json({ msg: `Ви не підписані на цього користувача` })
			}

			await prisma.follows.delete({
				where: {
					id: existingFollows.id,
				},
			})

			res.status(201).json({ msg: `Ви успішно відписались` })

		} catch (error) {
			console.error('Unfollow error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}


module.exports = FollowController;