const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
	register: async (req, res) => {
		const { name, email, password } = req.body
		if (!name || !email || !password) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		try {
			const registredUser = await prisma.user.findUnique({
				where: {
					email: email.toLowerCase()
				}
			})

			if (registredUser) {
				return res.status(400).json({ msg: `Користувач з такою електронною адресою вже існує` })
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt)

			const png = jdenticon.toPng(name, 200)
			const avatarName = `${name}_${Date.now()}.png`
			const avatarPath = path.join(__dirname, '../uploads', avatarName)
			fs.writeFileSync(avatarPath, png)

			const user = await prisma.user.create({
				data: {
					name: name,
					email: email.toLowerCase(),
					password: hashedPassword,
					avatarUrl: `/uploads/${avatarPath}`
				}
			})

			res.status(200).json(user)

		} catch (error) {
			console.error('Register error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	login: async (req, res) => {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		try {
			const user = await prisma.user.findUnique({
				where: {
					email: email.toLowerCase()
				}
			})

			if (!user) {
				return res.status(404).json({ msg: `Логін або пароль введено невірно` });
			}

			const isPasswordCorrect = await bcrypt.compare(password, user.password)
			if (!isPasswordCorrect) {
				return res.status(404).json({ msg: `Логін або пароль введено невірно` });
			}

			const secret = process.env.JWT_SECRET;
			const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' })

			res.status(200).json({
				token: token
			})

		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	getUserById: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const user = await prisma.user.findUnique({
				where: {
					id: id
				},
				include: {
					followers: true,
					following: true
				}
			})

			if (!user) {
				return res.status(404).json({ msg: `Користувача не знайдено` });
			}

			const isFollowing = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId: id }
					]
				}
			})

			res.json({ ...user, isFollowing: Boolean(isFollowing) })

		} catch (error) {
			console.error('Get user by ID error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	update: async (req, res) => {
		const { id } = req.params
		const { email, name, dateOfBirth, bio, location } = req.body

		let filePath

		if (req.file && req.file.path) {
			filePath = req.file.path
		}

		if (id !== req.user.userId) {
			return res.status(403).json({ msg: `Немає доступу` })
		}

		try {
			if (email) {
				const existingUser = await prisma.user.findFirst({
					where: {
						email: email.toLowerCase()
					}
				})

				if (existingUser && existingUser.id !== id) {
					return res.status(400).json({ msg: `Пошта вже використовується` })
				}
			}

			const user = await prisma.user.update({
				where: {
					id: id
				},
				data: {
					email: email || undefined,
					name: name || undefined,
					avatarUrl: filePath ? `/${filePath}` : undefined,
					dateOfBirth: dateOfBirth || undefined,
					bio: bio || undefined,
					location: location || undefined
				}
			})

			res.json(user)

		} catch (error) {
			console.error('Update user error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	current: async (req, res) => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: req.user.userId
				},
				include: {
					followers: {
						include: {
							follower: true
						}
					},
					following: {
						include: {
							following: true
						}
					},
				}
			})

			if (!user) {
				return res.status(404).json({ msg: `Користувача не знайдено` });
			}
			return res.status(200).json(user)

		} catch (error) {
			console.error('Get current error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}

module.exports = UserController;