process.env.DBFILE = "test.json";

var should = require('should');
var app = require('./utils');
var request = require('supertest-session')(app);


var poll = "test";
describe('Routes', function() {
    it('Get poll', function(done) {
        request.get('/' + poll)
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                var body = res.body;
                body.should.be.an.Array();
                body.should.not.be.empty();
                body[0].should.have.property('question');
                body[0].should.have.property('options');
                body[0].options.should.be.an.Array();
                body[0].options.should.not.be.empty();
                body[0].should.have.property('id');
                request.get('/tests2foo')
                    .expect(404)
                    .end(function(err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
    });
    it('Get Respuestas',function(done){
        request.get('/' + poll+'/resultados')
        .expect(200)
        .end(function(err, res) {
            should.not.exist(err);
            should.exist(res.body);
            var body = res.body;
            body.should.be.an.Array();
            body.should.not.be.empty();
            body[0].should.have.property('question');
            body[0].should.have.property('options');
            body[0].options.should.be.an.Array();
            body[0].options.should.not.be.empty();
            body[0].should.have.property('id');
            body[0].should.have.property('answers');
            body[0].answers.should.be.an.Array();
            body[0].answers.should.have.length(body[0].options.length);
            request.get('/tests2foo/resultados')
                .expect(404)
                .end(function(err, res) {
                    should.not.exist(err);
                    done();
                });
        });
    });
    it.skip('Post Respuesta', function(done) {
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
    it('Index', function(done) {
        request.get('/').expect(200).expect('Content-Type', 'text/html; charset=UTF-8').end(function(err, res) {
            should.not.exist(err);
            should.exist(res.body);
            done();
        });
    });
});
