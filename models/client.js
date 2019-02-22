let mongoose  = require('mongoose');

let ClientSchema = mongoose.Schema({
  website_name: {
    type: String,
    required: true,
    unique: true,
  },
  users: [{ type: mongoose.Types.ObjectId , ref: 'User'}],
  callback_url: {
      type: String,
      required: true
  },
  secret_key: {
    type: String,
    required: true
  },
  type_auth: {
    type: String,
    required: true
  },
  permissions: {
    type: String,
    required: true
  }
});

let Client = module.exports = mongoose.model('Client', ClientSchema);
