let mongoose  = require('mongoose');

let UserSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  phone: {
      type: String,
      required: true
  },
  dob: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  audio: {
    type: String,
    required: true
  }

});

let User = module.exports = mongoose.model('User', UserSchema);
