const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const createError = require('http-errors');

require('dotenv').config()
const app = express();

// Setting up CORS to work with cookies
app.use(cors({
	origin:
		process.env.NODE_ENV === "production"
			? "https://react-ts-rtk-vite-social-network.onrender.com"
			: "http://localhost:3000",
	credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connecting cookie-parser
app.use(cookieParser());

app.set('view engine', 'pug');

// Routes
app.use('/api', require('./routes'))

// Setting up React static file serving
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Setting up static distribution of uploaded files from the upload folder
// https://your-domain/uploads/file_name
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads')
}

// For all other routes, we send index.html from build
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
