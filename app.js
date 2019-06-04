const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("./cors");
const app = express();
let {sequelize} = require('./database');
let {second_sequelize} = require('./ai_database');
let bodyParser = require('body-parser');
let globalMiddleware = require('./middleware/globalMiddleware');

async function startDatabase(){
  return await sequelize.sync();
}

async function startAIDatabase(){
  return await second_sequelize.sync();
}

startDatabase();
startAIDatabase();

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bikesRouter = require('./routes/bikes');
const SchoolsRouter = require('./routes/schools');






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Show vue pages
app.use('/', indexRouter);

// Setup cors protection
cors.setupCorsConfig(app);
app.use('/auth', authRouter);
globalMiddleware(app);
app.use('/users', usersRouter);
app.use('/bikes', bikesRouter);
app.use('/Schools', SchoolsRouter);


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
