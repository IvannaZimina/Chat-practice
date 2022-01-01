const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

const expressServer = express();

// view engine setup
expressServer.set('views', path.join(__dirname, '../views'));
expressServer.set('view engine', 'ejs');

expressServer.use(logger('dev'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({ extended: false }));
expressServer.use(cookieParser());
expressServer.use(express.static(path.join(__dirname, '../public')));

expressServer.use('/', indexRouter);
expressServer.use('/users', usersRouter);

// catch 404 and forward to error handler
expressServer.use(function(req, res, next) {
  next(createError(404));
});

// error handler
expressServer.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = expressServer;
