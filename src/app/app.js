var restify = require('restify'),
    mongoose = require('mongoose'),
    passport = require('passport');

/* ===================== Server ======================= */
var server = restify.createServer({
    //contextPath
    name: 'myapp',
    version: '1.0.0'
});

//Enable Plugins
server.use(restify.queryParser());
server.use(restify.bodyParser());

//Enable Passport
server.use(passport.initialize());
server.use(passport.session());

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

/* ===================== Set Global Constant ======================= */
global.__base = __dirname;
global.__hash_algorithm = 'sha512';

/* ===================== DataBase ======================= */
server.db = mongoose.connect('mongodb://localhost:27017/restify');

/* ===================== Models ======================= */
require('./models/index')();

/* ===================== Passport Strategies ======================= */
require('./security/passport')(server);

/* ===================== Routes ======================= */
require('./routes/index')('/api', server);