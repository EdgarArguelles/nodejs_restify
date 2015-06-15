var passport = require('passport'),
    Error = require(__base + '/wrappers/error-msg');

var logIn = function (err, user, info, req, res, next) {
    if (err || !user) {
        res.send(Error.NOT_FOUND, Error.get(info ? info : "The user doesn't exist.", err && err.message ? err.message : ""));
        return;
    }
    req.logIn(user, function (err) {
        if (err) {
            res.send(Error.INTERNAL_SERVER_ERROR, Error.get("There was an error.", err.message));
            return;
        }
        user.password = undefined;
        res.send(user);
    });
};

module.exports = function (base, server) {
    server.post(base + "/signin", function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            logIn(err, user, info, req, res, next);
        })(req, res, next);
    });

    server.get(base + "/twitter", function (req, res, next) {
        passport.authenticate('twitter', {callbackURL: "http://" + req.headers.host + "/" + base + "/twitter/callback"})(req, res, next);
    });

    server.get(base + "/twitter/callback", function (req, res, next) {
        passport.authenticate('twitter', function (err, user, info) {
            logIn(err, user, info, req, res, next);
        })(req, res, next);
    });

    server.get(base + "/signout", function (req, res) {
        req.logout();
        res.send(200);
    });
};