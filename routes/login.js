const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/'
  })
);

module.exports = router;
