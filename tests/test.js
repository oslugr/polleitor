var assert = require('chai').assert;
var request = require('supertest');
var app = require('../server');



describe('Pruebas generales', function() {
    it('Routes', function(done) {
        request(app).get('/test')
            .expect(200)
            .end(function(err, res) {
                assert.notOk(err);
                assert.ok(res.body);
                var body = res.body;
                assert.ok(body.success);
                assert.equal(body.success, true);
                assert.ok(body.message);
                assert.ok(body.token);
                request(app).get('/tests2foo')
                    .expect(404)
                    .end(function(err, res) {
                        assert.notOk(err);
                        done();
                    });
            });
    });
});
