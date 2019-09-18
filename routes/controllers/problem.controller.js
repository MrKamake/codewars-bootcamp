const Problem = require('../../models/Problem');
const vm = require('vm');

exports.getOne = async function(req, res, next) {
  try {
    const problem = await Problem.findOne({ _id: req.params.problem_id });
    res.render('problem', { problem });
  } catch (err) {
    next(err);
  }
};

exports.examineCode = async function(req, res, next) {
  try {
    const testProblem = await Problem.findById(req.params.problem_id);
    const results = testProblem.tests.map(test => {
      const script = vm.createScript(req.body.solution + test.code);
      if (script.runInNewContext(script) === test.solution) {
        return true;
      } else {
        return script.runInNewContext(script);
      }
    });

    const isFailed = results.filter(result => result === false);

    if (isFailed.length) {
      res.render('failure');
    } else {
      res.render('success');
    }
  } catch (err) {
    next(err);
  }
};
