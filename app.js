/* eslint-disable linebreak-style */
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();
// connecting to Database
// const db = require('./db/db');

const ethersRouter = require('./routes/ethers');
const ccxtRouter = require('./routes/ccxt');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', ethersRouter);
app.use('/ccxt', ccxtRouter);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
  });

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
