const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

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
		res.send('getAllPosts')
	},

	getPostById: async (req, res) => {
		res.send('getPostById')
	},

	deletePost: async (req, res) => {
		res.send('deletePost')
	},
}

module.exports = PostController;