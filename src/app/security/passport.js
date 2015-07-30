var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function (base, server) {
    var User = server.db.models.User;

    // setup middleware
    server.use(function (req, res, next) {
        req.session.expires = new Date(Date.now() + __session_time);
        var validate = req.url.indexOf(base) === 0;
        if (validate && !req.isAuthenticated()) return res.send(401, 'You shall not pass!');
        return next();
    });

    // Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, function (username, password, done) {
        User.findOne({name: username}, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, "The user doesn't exist.");
            if (user.password != User.hashPassword(password)) return done(null, false, "The password is incorrect.");
            return done(null, user);
        });
    }));

    // Twitter Strategy
    if (__twitter_oauth_key) {
        passport.use(new TwitterStrategy({
                consumerKey: __twitter_oauth_key,
                consumerSecret: __twitter_oauth_secret
            },
            function (token, tokenSecret, profile, done) {
                return done(null, profile);
            }));
    }

    // Serialize (call after req.logIn function is called)
    passport.serializeUser(function (user, done) {
        var userData = {
            name: user.name,
            roles: user.roles
        };
        done(null, userData);
    });

    // Deserialize (called before any request when req.isAuthenticated(), and its used to inject
    // the req.user object with the user data)
    passport.deserializeUser(function (userData, done) {
        done(null, userData);
    });
};