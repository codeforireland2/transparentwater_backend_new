const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // eslint-disable-line no-unused-vars
const Promise = require('bluebird'); // eslint-disable-line no-unused-vars
// const viewEngine = require('express-json-views');

// Load app
const app = express();

// Loading routers
const noticesRouter = require('./routes/notices');

// Set view engine, JSON (not in use yet)
// See https://www.npmjs.com/package/express-json-views
// app.engine('json', viewEngine());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'json');

// DB connection
const db = require('./model/db'); // eslint-disable-line no-unused-vars
const notice = require('./model/notice'); // eslint-disable-line no-unused-vars

// view engine setup
// No views required yet
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

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
  // res.render('error');
  res.send('{error: "Error"}');
});

module.exports = app;
