const Problem = require('../../models/Problem');
const vm = require('vm');

exports.getOne = async function(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.problem_id);
    res.render('problem', { problem });
  } catch (err) {
    next();
  }
};

exports.examineCode = async function(req, res, next) {
  const resultMsgs = { success: [], failure: [] };
  try {
    const problem = await Problem.findById(req.params.problem_id);
    const userSolutionCode = req.body.solution;
    problem.tests.forEach(test => {
      const script = new vm.Script(`${userSolutionCode} ${test.code}`);
      const context = vm.createContext({});
      const result = script.runInContext(context, { timeout: 1000 });

      if (result === test.solution) {
        resultMsgs.success.push(`[${test.code}]`);
      } else {
        resultMsgs.failure.push(
          `[${test.code}] Expected: ${test.solution}, instead got: ${result}`
        );
      }
    });
    if (resultMsgs.failure.length) {
      throw new Error();
    }
    
    res.render('success');
  } catch (err) {
    if (resultMsgs.failure.length) {
      res.render('failure', { resultMsgs });
    } else {
      res.render('failure', { err });
    }
  }
};
