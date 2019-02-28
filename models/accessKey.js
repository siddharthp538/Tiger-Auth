const mongoose = require('mongoose');
let AccessKeySchema =  mongoose.Schema({
    accessToken: {
        type: String,
    }
})
let AccessKey = module.exports=  mongoose.model('AccessKey', AccessKeySchema);