var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (server) {
    var User = server.db.models.User;

    // Local
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

    // Facebook
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