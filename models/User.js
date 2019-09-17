const mongoose = require('mongoose');

/*

  TODO: Fill in the model specification

 */
const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    require: true,
    unique: true
  },
  username: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
