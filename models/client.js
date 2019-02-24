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
  }
});

let Client = module.exports = mongoose.model('Client', ClientSchema);
