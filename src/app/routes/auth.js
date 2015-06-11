var passport = require('passport'),
    Error = require(__base + '/wrappers/error-msg');

module.exports = function (base, server) {
    server.post(base + "/signin", function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                res.send(Error.NOT_FOUND, Error.get(err && err.show ? err.show : "The user doesn't exist.", err && err.message ? err.message : ""));
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
        })(req, res, next);
    });
};