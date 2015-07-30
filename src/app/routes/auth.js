var passport = require('passport'),
    Error = require(__base + '/wrappers/error-msg');

var logIn = function (err, user, info, req, res, next) {
    if (err || !user) {
        res.send(Error.NOT_FOUND, Error.get(info ? info : "The user doesn't exist.", err && err.message ? err.message : ""));
        return;
    }
    // the function req.logIn only tells the server the req session is authenticated,
    // that means req.isAuthenticated() = true, the user parameter is used on passport.serializeUser
    // in order to be serialized and deserialized on next request.
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
        // process the passport LocalStrategy behavior and then call the defined callback
        passport.authenticate('local', function (err, user, info) {
            logIn(err, user, info, req, res, next);
        })(req, res, next);
    });

    // signin with twitter
    server.get(base + "/signin/twitter", function (req, res, next) {
        // call the twitter API with the TwitterStrategy parameters and then callback the defined url
        passport.authenticate('twitter', {callbackURL: "http://" + req.headers.host + "/" + base + "/signin/twitter/callback"})(req, res, next);
    });

    // callback after twitter API process the request
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
        // the function req.logout only tells the server the req session is not authenticated,
        // that means req.isAuthenticated() = false
        req.logout();
        res.send(200);
    });
};