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
    var User = server.db.models.User;

    // signin local users
    server.post(base + "/signin", function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            logIn(err, user, info, req, res, next);
        })(req, res, next);
    });

    // signin with twitter
    server.get(base + "/signin/twitter", function (req, res, next) {
        passport.authenticate('twitter', {callbackURL: "http://" + req.headers.host + "/" + base + "/signin/twitter/callback"})(req, res, next);
    });

    server.get(base + "/signin/twitter/callback", function (req, res, next) {
        passport.authenticate('twitter', function (err, profile, info) {
            User.findOne({twitterId: profile.id}, function (err, user) {
                if (!user) info = "No users found linked to your Twitter account. You may need to enroll an account first.";
                logIn(err, user, info, req, res, next);
            });
        })(req, res, next);
    });

    // signout
    server.get(base + "/signout", function (req, res) {
        req.logout();
        res.send(200);
    });
};