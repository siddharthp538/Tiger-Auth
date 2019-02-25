let mongoose  = require('mongoose');

let ClientSchema = mongoose.Schema({
  domainName : {
    type: String,
    required: true,
    unique: true
  },
  secretKey : {
    type: String,
    required: true,
    unique: true
  },
  face : {
    type: Boolean,
    required: true,
  },
  otp: {
    type: Boolean,
    required: true,
  },
  voice: {
    type: Boolean,
    required: true,
  }
});

let Client = module.exports = mongoose.model('Client', ClientSchema);
