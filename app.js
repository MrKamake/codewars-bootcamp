const express = require('express');

const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const userPassport = require('./routes/middlewares/passport');

const index = require('./routes/index');
const login = require('./routes/login');
const problem = require('./routes/problem');

require('dotenv').config();

const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(`${process.env.DATABASE_URL}`, {
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
app.use(passport.session());

userPassport(passport);

app.use('/', index);
app.use('/login', login);
app.get('/logout', function(req, res, next) {
  req.logOut();
  res.redirect('/login');
});
app.use('/problems', problem);

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
  if (err.status === 500) message = 'Internal Server Error';
  res.render('error');
});

module.exports = app;
