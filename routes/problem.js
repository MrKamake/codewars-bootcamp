const express = require('express');
const router = express.Router();

const problemController = require('./controllers/problem.controller');
const verifyAuthentication = require('./middlewares/authorization');

router.get('/:problem_id', verifyAuthentication, problemController.getOne);
router.post(
  '/:problem_id/solution',
  verifyAuthentication,
  problemController.examineCode
);

module.exports = router;
