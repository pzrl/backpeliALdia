var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const User = require('./models/user');
const Theater = require('./models/theater');
const Movie = require('./models/movie');
const Search = require('./models/search');
const Social = require('./models/socialM');
const General = require('./models/general');
const cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var theatersRouter = require('./routes/theaters');
var moviesRouter = require('./routes/movies');
var searchsRouter = require('./routes/searchs');
var chatsRouter = require('./routes/chats');
var socialRouter = require('./routes/social');
var apiFilmAffinityRouter = require('./routes/api');

var app = express();

require('./db')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/theaters', theatersRouter);
app.use('/movies', moviesRouter);
app.use('/searchs', searchsRouter);
app.use('/chats', chatsRouter);
app.use('/social', socialRouter);
app.use('/api', apiFilmAffinityRouter);

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
