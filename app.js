const express = require('express');

const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const userPassport = require('./routes/middlewares/passport');

const index = require('./routes/index');
const login = require('./routes/login');

require('dotenv').config();

const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(`${process.env.LOCAL_HOST_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connect MongoDB');
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session()); // 로그인 세션 유지

userPassport(passport);

app.use('/', index);
app.use('/login', login);
app.get('/logout', function(req, res, next) {
  req.logOut();
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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
