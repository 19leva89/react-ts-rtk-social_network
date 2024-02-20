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
			console.error(error);
			res.status(500).json({ msg: `Щось пішло не так` })
		}
	},
	login: async (req, res) => {
		res.send('login')
	},
	getUserById: async (req, res) => {
		res.send('getUserById')
	},
	update: async (req, res) => {
		res.send('update')
	},
	current: async (req, res) => {
		res.send('current')
	},
}

module.exports = UserController;