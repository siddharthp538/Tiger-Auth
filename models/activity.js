let mongoose = require('mongoose');

let ActivitySchema = mongoose.Schema({
    username: {
        type: String,
        required: true
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
    }
}, { timestamps : true});

let Activity = module.exports = mongoose.model('Activity', ActivitySchema);
