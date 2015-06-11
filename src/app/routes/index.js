module.exports = function (base, server) {
    require('./auth')(base + '/auth', server);

    // module1
    require('./module1/user')(base + '/users', server);
    require('./module1/personal')(base + '/personals', server);
};