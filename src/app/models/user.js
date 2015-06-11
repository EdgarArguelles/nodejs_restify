var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function () {
    var User = new mongoose.Schema({
        name: {type: String, required: true, minlength: 5, maxlength: 10},
        password: {type: String, required: true},
        roles: {
            name: {type: String, required: true},
            permissions: {type: [String]}
        }
    }, {versionKey: false});

    User.statics.hashPassword = function (password) {
        return crypto.createHash(__hash_algorithm).update(password).digest('hex');
    };

    mongoose.model('User', User);
};