const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    Problem.find((err, problems) => {
      res.render('index', { problems });
    });
  } else {
    res.status(301).redirect('/login');
  }
});

module.exports = router;
