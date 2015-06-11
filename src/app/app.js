var restify = require('restify');
var mongoose = require('mongoose');

/* ===================== Server ======================= */
var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

//server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(restify.fullResponse())
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

/* ===================== Routes ======================= */
require('./routes/index')('/api', server);