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
  },
  permissions: {
    name: {
      type: Boolean ,
      required: true,
      default: false 
    },
    username: {
      type: Boolean,
      required: true,
      default: false
    },
    phone: {
      type: Boolean,
      required: true,
      default: false
    },
    dob: {
      type: Boolean,
      required: true,
      default: false
    },
    img: {
      type:Boolean,
      required: true,
      default: false
    },
    audio: {
      type: Boolean,
      required: true,
      default: false
    }

  }
});

let Client = module.exports = mongoose.model('Client', ClientSchema);
