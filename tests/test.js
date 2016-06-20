var should=require('should');
var request = require('supertest');
var app = require('../server');



describe('Pruebas generales', function() {
    it('Routes', function(done) {
        request(app).get('/test')
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                var body = res.body;
                body.should.have.property('success',true);
                body.should.have.property('message');
                body.should.have.property('token');
                request(app).get('/tests2foo')
                    .expect(404)
                    .end(function(err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
    });
});
