const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

/* GET home page. */
router.get('/', (req, res, next) => {
  Problem.find((err, problems) => {
    res.render('index', { problems, user: req.user });
  });
});

module.exports = router;
