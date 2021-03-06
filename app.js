var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morganlogger = require('morgan');
var logger = require('./utils/logger')('app');
var log = logger.log;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

console.log('\n');
console.log('-----------SETTINGS----------------');
console.log('NODE_ENV:' + process.env.NODE_ENV);
console.log('LOG_TO_DB:' + process.env.LOG_TO_DB);
console.log('LOG_TO_FILES:' + process.env.LOG_TO_FILES);
console.log('APP_LOG_FILE:' + process.env.APP_LOG_FILE);
console.log('ERROR_LOG_FILE:' + process.env.ERROR_LOG_FILE);
console.log('-----------SETTINGS----------------');
console.log('\n');

log.info('APP INITIALIZED');
log.debug("Overriding 'Express' logger");
app.use(morganlogger('combined', { 'stream': logger.stream }));
log.info('Some info');
log.error('Some error');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
