let mongoose  = require('mongoose');

let ClientSchema = mongoose.Schema({
  websiteName : {
    type: String,
    required: true,
    unique: true
  },
  secretKey : {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  }
});

let Client = module.exports = mongoose.model('Client', ClientSchema);
