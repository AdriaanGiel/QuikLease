let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let {sequelize} = require('./database');
let {second_sequelize} = require('./ai_database');
let bodyParser = require('body-parser');
let passport = require('passport');
let session = require('express-session');
let flash = require("connect-flash");

async function startDatabase(){
  return await sequelize.sync();
}

async function startAIDatabase(){
  return await second_sequelize.sync();
}

startDatabase();
startAIDatabase();

let authRouter = require('./routes/auth');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

var app = express();

require("./passport");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "fleet" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
