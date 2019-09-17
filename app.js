const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const index = require('./routes/index');
const bodyParser = require('body-parser');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

mongoose.connect(`${process.env.LOCAL_HOST_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connect MongoDB');
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_PW}`,
      callbackURL: `${process.env.CALLBACK_URL}`
    },
    function(accessToken, refreshToken, profile, done) {
    //   User.findOrCreate({ googleId: profile.id }, function(err, user) {
    //     return done(err, user);
    //   });
    }
  )
);

const app = express();

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', index);

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
