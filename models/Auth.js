const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const AuthSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Auth', AuthSchema);