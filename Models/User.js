const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Boolean,
    required: true,
  }
})

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10, (err, hashPass) => {
    if(err) return next(err);
    this.password = hashPass;
    next();
  })
})

module.exports = mongoose.model('User', UserSchema);