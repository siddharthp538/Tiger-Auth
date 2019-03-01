let mongoose  = require('mongoose');

let VoiceSchema = mongoose.Schema({
  profileID: {
    type: String,
    required: true
  }
});

let VoiceSchema = module.exports = mongoose.model('Voice', VoiceSchema);
