var mongoose = require('mongoose');

module.exports = function () {
    var Personal = new mongoose.Schema({
        firstName: {type: String, required: true},
        lastName: {type: String},
        users: {
            id: {type: mongoose.Schema.Types.ObjectId, required: true}
        }
    }, {versionKey: false});

    Personal.virtual('fullName').get(function () {
        return this.firstName + " " + (this.lastName ? this.lastName : "");
    });

    mongoose.model('Personal', Personal);
};