var request = require('request'),
    assert = require('assert');

describe('GET /', function () {
    it("user UNAUTHORIZED should respond with status 401", function (done) {
        request('http://localhost:3000/api/users', function (err, resp) {
            assert.equal(resp.statusCode, 401);
            done();
        });
    });
});