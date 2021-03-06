let mongoose = require('mongoose');

let User1Schema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
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
    required: true,
    unique: true,
  },
  audio: {
    audio1: {
      type: String,
      required: true,
    },
    audio2: {
      type: String,
      required: true,
    },
    audio3: {
      type: String,
      required: true,
    },
    audio4: {
      type: String,
      required: true,
    },
    audio5: {
      type: String,
      required: true,
    }

  },
  applications :[{
    clientId : {
      type : mongoose.Types.ObjectId,
      ref: 'client'
    },
    domainName: {
      type:String
    }
  }]
});

let User1 = module.exports = mongoose.model('User1', User1Schema);
