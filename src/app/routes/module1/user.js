var Error = require(__base + '/wrappers/error-msg');

module.exports = function (base, server) {
    var User = server.db.models.User;

    server.get(base + '/', function (req, res) {
        User.find({}, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err ? JSON.stringify(err) : ""));
                return;
            }
            res.send(doc);
        });
    });

    server.get(base + '/:id', function (req, res) {
        User.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err ? JSON.stringify(err) : ""));
                return;
            }
            res.send(doc);
        });
    });

    server.post(base + '/new', function (req, res) {
        req.body.password = User.hashPassword(req.body.password);
        var newUser = new User(req.body);
        newUser.save(function (err, doc) {
            if (err) {
                res.send(Error.BAD_REQUEST, Error.fromErrors(err.errors));
                return;
            }
            res.send(doc);
        });
    });

    server.put(base + '/:id', function (req, res) {
        User.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err ? JSON.stringify(err) : ""));
                return;
            }

            doc.name = req.body.name;
            doc.password = User.hashPassword(req.body.password);
            doc.roles = req.body.roles;
            doc.save(function (err, doc) {
                if (err) {
                    res.send(Error.BAD_REQUEST, Error.fromErrors(err.errors));
                    return;
                }
                res.send(doc);
            });
        });
    });
};