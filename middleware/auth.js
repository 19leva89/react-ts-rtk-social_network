const { prisma } = require('./../prisma/prisma-client');
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {

	const token = req.headers.authorization?.split(' ')[1]
	if (!token) {
		return res.status(401).json({ msg: `Токен відсутній. Будь ласка, увійдіть, щоб продовжити` });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ msg: `Токен невалідний` })
		}

		req.user = user

		next()
	})
}

module.exports = { authenticateToken };