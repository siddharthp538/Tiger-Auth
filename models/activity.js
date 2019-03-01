let mongoose = require('mongoose');

let ActivitySchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
        required: true
    },
    domainName: {
        type: String,
        required: true,
    },
    timeOfLogin: {
        type: String,
        required: true
    },
    typeOfDevice: {
        type: String,
        required: true
    }


});

let Activity = module.exports = mongoose.model('Activity', ActivitySchema);
