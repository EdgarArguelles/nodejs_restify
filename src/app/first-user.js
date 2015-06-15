module.exports = function (User) {
    // create at least one user
    User.find({}, function (err, doc) {
        if (err) {
            console.log(JSON.stringify(err));
            return;
        }
        if (doc && doc.length > 0) {
            return;
        }
        var newUser = User({
                name: "usertest",
                password: "123",
                roles: {
                    name: "rol1"
                }
            }
        );
        newUser.password = User.hashPassword(newUser.password);
        newUser.save(function (err, doc) {
            if (err) {
                console.log(JSON.stringify(err));
            }
            console.log("user created : " + JSON.stringify(doc));
        });
    });
};