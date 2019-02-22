let mongoose = require('mongoose');

let AuthSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  IP: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  cookies: {
    type: String,
    required: true
  }
});

let Auth = module.exports = mongoose.model('Auth', AuthSchema);
