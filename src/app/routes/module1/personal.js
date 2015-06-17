var Error = require(__base + '/wrappers/error-msg');

module.exports = function (base, server) {
    var Personal = server.db.models.Personal;

    server.get(base + '/', function (req, res) {
        Personal.find({}, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
                return;
            }
            res.send(doc);
        });
    });

    server.get(base + '/:id', function (req, res) {
        Personal.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
                return;
            }
            res.send(doc);
        });
    });

    server.post(base + '/new', function (req, res) {
        var newPersonal = new Personal(req.body);
        newPersonal.save(function (err, doc) {
            if (err) {
                res.send(Error.BAD_REQUEST, Error.fromErrors(err.errors));
                return;
            }
            res.send(doc);
        });
    });

    server.put(base + '/:id', function (req, res) {
        Personal.findById(req.params.id, function (err, doc) {
            if (err || !doc) {
                res.send(Error.NOT_FOUND, Error.get("No data available.", err));
                return;
            }

            doc.firstName = req.body.firstName;
            doc.lastName = req.body.lastName;
            doc.users = req.body.users;
            doc.save(function (err, doc) {
                if (err) {
                    res.send(Error.BAD_REQUEST, Error.fromErrors(err.errors));
                    return;
                }
                res.send(doc);
            });
        });
    });
};