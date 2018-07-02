const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Promise = require('bluebird'); // eslint-disable-line no-unused-vars
const mongoose = require('mongoose');

mongoose.Promise = Promise;

// Load app
const app = express();

// Loading routers
const noticesRouter = require('./routes/notices');

// DB connection
const db = require('./model/db'); // eslint-disable-line no-unused-vars
const notice = require('./model/notice'); // eslint-disable-line no-unused-vars

// Connecting routers
app.use('/notice', noticesRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('{error: "Error"}');
});

module.exports = app;
