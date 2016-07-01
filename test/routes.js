var should = require('should');
var config = require('../app/config');
config.loki_db_name = "test.json";
var testInit = require('./init');
var poll = Object.keys(config.polls)[0]; // Usa la primera encuesta

var supertest = require('supertest-session');

// start tests
/*dbHandler( function( handler ) {
    
    describe('Loki', function () {
	it('Check polls', function(done) {
	    should.exist(handler.checkPoll(poll));
	    done();
	});
    });
});*/

describe('Routes', function() {
    var app;
    var dbHandler;
    var request;
    before(function(done) {
        testInit.init(function(app2, handler) {
            should.exist(app2);
            should.exist(handler);
            app = app2;
            dbHandler = handler;
            request = supertest(app);
            done();
        });
    });
    after(function() {
        testInit.close();
    });
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
    it('Get Respuestas', function(done) {
        request.get('/' + poll + '/resultados')
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
    it('Post Respuesta', function(done) {
        //Ninguna respuesta
        request.get('/' + poll + '/resultados')
            .expect(200)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res.body);
                var body = res.body;
                body[0].should.have.property('options');
                body[0].should.have.property('answers');
                body[0].answers.should.be.an.Array();
                body[0].answers.should.not.be.empty();
                body[0].answers[0].should.be.equal(0);
                body[0].answers[1].should.be.equal(0);
                //Respondemos 1 pregunta
                request.put('/' + poll)
                    .expect(200)
                    .send({
                        answers: [{
                            id: body[0].id,
                            answer: 0
                        }]
                    })
                    .end(function(err, res) {
                        should.not.exist(err);
                        should.exist(res.body);
                        res.body.should.have.property('updates', 1);
                        res.body.should.have.property('failedUpdates', 0);
                        //Comprobar actualización
                        request.get('/' + poll + '/resultados')
                            .expect(200)
                            .end(function(err, res) {
                                should.not.exist(err);
                                should.exist(res.body);
                                var body = res.body;
                                body[0].should.have.property('answers');
                                body[0].answers.should.be.an.Array();
                                body[0].answers.should.not.be.empty();
                                body[0].answers[0].should.be.equal(1);
                                body[0].answers[1].should.be.equal(0);
                                //Respondemos misma pregunta
                                request.put('/' + poll)
                                    .expect(200)
                                    .send({
                                        answers: [{
                                            id: body[0].id,
                                            answer: 0
                                        }]
                                    })
                                    .end(function(err, res) {
                                        should.not.exist(err);
                                        should.exist(res.body);
                                        //Error en update
                                        res.body.should.have.property('updates', 0);
                                        res.body.should.have.property('failedUpdates', 1);
                                        //Comprobar que no hay cambos en los resultados
                                        request.get('/' + poll + '/resultados')
                                            .expect(200)
                                            .end(function(err, res) {
                                                should.not.exist(err);
                                                should.exist(res.body);
                                                var body = res.body;
                                                body[0].should.have.property('answers');
                                                body[0].answers.should.be.an.Array();
                                                body[0].answers.should.not.be.empty();
                                                body[0].answers[0].should.be.equal(1);
                                                body[0].answers[1].should.be.equal(0);
                                                done();
                                            });
                                    });
                            });
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
