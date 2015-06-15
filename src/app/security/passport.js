var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (base, server) {
    var User = server.db.models.User;

    // setup middleware
    server.use(function (req, res, next) {
        req.session.expires = new Date(Date.now() + __session_time);
        var validate = req.url.indexOf(base) === 0 && req.url !== base + "/auth/signin";
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

    // Facebook Strategy
    /*if (server.get('facebook-oauth-key')) {
     passport.use(new FacebookStrategy({
     clientID: server.get('facebook-oauth-key'),
     clientSecret: server.get('facebook-oauth-secret')
     },
     function (accessToken, refreshToken, profile, done) {
     // Hand off to caller
     done(null, false, {
     accessToken: accessToken,
     refreshToken: refreshToken,
     profmongooseile: profile
     });
     }));
     }*/

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