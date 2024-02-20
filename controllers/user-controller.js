const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcryptjs');
const jdenticon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body
			if (!name || !email || !password) {
				return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
			}

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
			const avatarPath = path.join(__dirname, './../uploads', avatarName)
			fs.writeFileSync(avatarPath, png)

			const user = await prisma.user.create({
				data: {
					name: name,
					email: email.toLowerCase(),
					password: hashedPassword,
					avatarUrl: `/uploads/${avatarPath}`
				}
			})

			return res.status(201).json({
				id: user.id,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
			})


		} catch (error) {
			console.error('Register error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
			}

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
				id: user.id,
				email: user.email,
				name: user.name,
				token: token
			})

		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},

	getUserById: async (req, res) => {
		res.send('getUserById')
	},

	update: async (req, res) => {
		res.send('update')
	},

	current: async (req, res) => {
		try {
			return res.status(200).json(req.user)

		} catch (error) {
			console.error('Current error:', error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
}

module.exports = UserController;