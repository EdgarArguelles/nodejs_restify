var restify = require('restify'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    sessions = require("express-session");

/* ===================== Set Global Constant ======================= */
global.__base = __dirname;
global.__hash_algorithm = 'sha512';
global.__session_time = 15 * 60 * 1000;

/* ===================== Server ======================= */
var base_path = "/api";
var server = restify.createServer({
    //contextPath
    name: 'myapp',
    version: '1.0.0'
});

//Enable Plugins
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(sessions({
    // the cookie is encrypted, so needs a secret key
    secret: 'f28-54#$"2"#$kj454s',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: global.__session_time
    }
}));

//Enable Passport
server.use(passport.initialize());
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