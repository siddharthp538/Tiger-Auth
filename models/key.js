let mongoose  = require('mongoose');
let KeySchema  = mongoose.Schema({
    token: {
        type: String,
    }
})

let Key = module.exports = mongoose.model('Key', KeySchema);