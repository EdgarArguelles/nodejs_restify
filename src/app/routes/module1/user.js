var passport = require('passport'),
    Error = require(__base + '/wrappers/error-msg');

module.exports = function (base, server) {
    var User = server.db.models.User;

    server.get(base + '/', function (req, res) {
        User.find({}, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
                return;
            }
            res.send(doc);
        });
    });

    server.get(base + '/:id', function (req, res) {
        User.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
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
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
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

    // enroll user with twitter
    server.get(base + "/:id/enroll/twitter", function (req, res, next) {
        User.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("The user doesn't exist.", err));
                return;
            }
            passport.authenticate('twitter', {callbackURL: "http://" + req.headers.host + "/" + base + "/" + req.params.id + "/enroll/twitter/callback"})(req, res, next);
        });
    });

    server.get(base + "/:id/enroll/twitter/callback", function (req, res, next) {
        passport.authenticate('twitter', function (err, profile, info) {
            User.findById(req.params.id, function (err, doc) {
                if (err || !doc) {
                    res.send(Error.NOT_FOUND, Error.get("The user doesn't exist.", err));
                    return;
                }

                doc.twitterId = profile.id;
                doc.save(function (err, doc) {
                    if (err) {
                        res.send(Error.BAD_REQUEST, Error.fromErrors(err.errors));
                        return;
                    }
                    res.send(doc);
                });
            });
        })(req, res, next);
    });
};