var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function (base, server) {
    var User = server.db.models.User;

    // setup middleware (intercept all request)
    server.use(function (req, res, next) {
        // not all the request are validated, for example with some calls like auth/signin the user
        // authentication is not needed.
        var validate = req.url.indexOf(base) === 0;
        if (validate && !req.isAuthenticated()) return res.send(401, 'You shall not pass!');
        return next();
    });

    // Configure the Local Strategy behavior when passport.authenticate('local') is called
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

    // Configure the Twitter Strategy parameters needed when passport.authenticate('twitter') is called
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
        // the userData object is stored into req.session.passport.user, then passport stores the whole session data
        // on memory database with the client cookie value as key
        done(null, userData);
    });

    // Deserialize (called before any request when req.isAuthenticated() === true)
    // after passport reads the cookie value (key) from client, gets the session data from memory database and
    // uses this function to inject the "user" attribute into the request, the first parameter
    // is the req.session.passport.user value (previously stored on passport.serializeUser process)
    passport.deserializeUser(function (userData, done) {
        // injects the userData into the request, it could be accessed with req.user,
        // in this case req.session.passport.user = req.user
        done(null, userData);
    });
};