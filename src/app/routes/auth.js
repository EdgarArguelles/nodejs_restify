var Error = require(__base + '/wrappers/error-msg');

module.exports = function (base, server) {
    var User = server.db.models.User;

    server.post(base + '/signin', function (req, res) {
        User.findOne({'name': req.body.name, 'password': User.hashPassword(req.body.password)}, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("The user doesn't exist.", err ? JSON.stringify(err) : ""));
                return;
            }
            res.send(doc);
        });
    });
};