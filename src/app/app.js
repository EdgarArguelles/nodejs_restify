var restify = require('restify'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    sessions = require("express-session"),
    MongoStore = require('connect-mongodb');

/* ===================== Set Global Constant ======================= */
global.__base = __dirname;
global.__hash_algorithm = 'sha512';
global.__session_time = 15 * 60 * 1000;

// set the twitter information
global.__twitter_oauth_key = "";
global.__twitter_oauth_secret = "";

/* ===================== Server ======================= */
var base_path = "/api";
var server = restify.createServer({
    name: 'nodejs_restify',
    version: '1.0.0'
});

//Enable Plugins
server.use(restify.queryParser());
server.use(restify.bodyParser());
// the server creates a new session each request without a cookie, then persists this session data on a
// memory database (or any other Session Stores) using an unique key, finally this key is send to client
// as a cookie value, next requests will content the cookie and the server will get the same session data than before.
server.use(sessions({
    secret: 'f28-54#$"2"#$kj454s', // the session ID cookie is encrypted, so needs a secret key
    saveUninitialized: false,
    resave: false,
    // where the session data will be stored (default MemoryStore)
    // MemoryStore is good for development time but its not recommended for production is better to use mongo or redis
    /*store: new MongoStore({
     url: 'mongodb://localhost:27017/restify',
     collectionName: 'sessions',
     timeout: 10000
     }),*/
    rolling: true, // Force a cookie to be set on every response. This resets the expiration date.
    cookie: {
        maxAge: global.__session_time // the cookie will expired on global.__session_time milliseconds
    }
}));

//Enable Passport
server.use(passport.initialize());
// passport will use the server session in order to read and inject new attributes
// like req.session.passport.user and req.user
server.use(passport.session());

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

/* ===================== DataBase ======================= */
server.db = mongoose.connect('mongodb://localhost:27017/restify');

/* ===================== Models ======================= */
require('./models/index')();

/* ===================== Passport Strategies ======================= */
require('./security/passport')(base_path, server);

/* ===================== Routes ======================= */
require('./routes/index')(base_path, server);

/* ===================== Create at least one user ======================= */
require('./first-user')(server.db.models.User);