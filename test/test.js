var should = require('should');
var app = require('../server');
var request = require('supertest-session')(app);


var id = "test";
describe('Pruebas generales', function() {
    it('Token', function(done) {
        request.get('/' + id + '/check')
            .expect(404)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                res.body.should.have.property('success', false);
                request.get('/' + id)
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
                                request.get('/' + id + '/check')
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
    it('Crear Respuesta', function(done) {
        request.get('/' + id)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                var body = res.body;
                body.should.have.property('success', true);
                body.should.have.property('message');
                body.should.have.property('token');
                var token = body.token;
                request.put('/' + id + '/' + token + '/a').expect(200).end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res.body);
                    //TODO: finish test
                    done();
                });
            });
    });
    it('Index',function(done){
        request.get('/').expect(200).expect('Content-Type', 'text/html; charset=UTF-8').end(function(err,res){
            should.not.exist(err);
            should.exist(res.body);
            done();            
        });
    });
    it('id/p',function(done){
        request.get('/'+id+'/p/v').expect(200).end(function(err,res){
            should.not.exist(err);
            should.exist(res.body);
            should.exist(res.text); //¿?
            done();            
        });
    });
});
