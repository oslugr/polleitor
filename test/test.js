var should = require('should');
var app = require('../server');
var request = require('supertest-session')(app);

describe('Pruebas generales', function() {
    it('Token', function(done) {
        request.get('/test/check')
            .expect(404)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                res.body.should.have.property('success',false);
                request.get('/test')
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        should.exist(res.body);
                        var body = res.body;
                        body.should.have.property('success', true);
                        body.should.have.property('message');
                        body.should.have.property('token');
                        request.get('/tests2foo')
                            .expect(404)
                            .end(function(err, res) {
                                should.not.exist(err);
                                request.get('/test/check')
                                    .expect(200)
                                    .end(function(err, res) {
                                        should.not.exist(err);
                                        should.exist(res.body);
                                        done();
                                    });
                            });
                    });
            });
    });
});
