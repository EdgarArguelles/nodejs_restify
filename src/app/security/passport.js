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
                User.findOne({twitterId: profile.id}, function (err, user) {
                    if (err) return done(err);
                    if (!user) return done(null, false, "No users found linked to your Twitter account. You may need to create an account first.");
                    return done(err, user);
                });
            }));
    }

    // Serialize
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // Deserialize
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};