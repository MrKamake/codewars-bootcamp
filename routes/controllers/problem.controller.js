const Problem = require('../../models/Problem');

exports.getOne = async function(req, res, next) {
  try {
    const problem = await Problem.findOne({ _id: req.params.problem_id });
    res.render('problem', { problem });
  } catch (err) {
    next();
    res.status(500).json({ errMessage: 'Internal Server Error' });
  }
};

exports.examineCode = async function(req, res, next) {
  try {
    console.log(req.body);
    res.send({});
  } catch (err) {
    next();
    res.status(500).json({ errMessage: 'Internal Server Error' });
  }
};
