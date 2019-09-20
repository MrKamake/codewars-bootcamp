const mongoose = require('mongoose');

/*

  TODO: Fill in the model specification

 */
const ProblemSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  title: {
    type: String
  },
  difficulty_level: {
    type: Number
  },
  completed_users: {
    type: Number
  },
  description: {
    type: String
  },
  tests: [{
    code: {
      type: String,
      require: true
    },
    solution: {
      type: mongoose.Schema.Types.Mixed,
      require: true
    }
  }]
});

module.exports = mongoose.model('Problem', ProblemSchema);
