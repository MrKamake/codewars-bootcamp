const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const index = require('./routes/index');
const login = require('./routes/login');
const bodyParser = require('body-parser');
const User = require('./models/User')

mongoose.connect(`${process.env.LOCAL_HOST_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connect MongoDB');
});

const GitHubStrategy = require('passport-github').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, cb) {
      console.log(profile);

      const newUser = new User({user_id: profile.id, username: profile.username});
      await newUser.save();

      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true
  })
);
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session()); // 로그인 세션 유지

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
