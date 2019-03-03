let mongoose  = require('mongoose');
let CredentialSchema  = mongoose.Schema({
    domainName: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    }
})

let Credential = module.exports = mongoose.model('Credential', CredentialSchema);