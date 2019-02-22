let mongoose  = require('mongoose');

let UserSchema = mongoose.schema({
  name: {
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
  }
});

let User = module.exports = mongoose.model('User', UserSchema);
