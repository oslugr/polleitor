var should = require('should');
var config = require('../app/config');
config.loki_db_name = "test.json";
var testInit = require('./init');
var fs = require('fs');
var poll = Object.keys(config.polls)[0]; // Usa la primera encuesta


var supertest = require('supertest-session');

describe('Loki', function() {
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
            try {
                fs.unlinkSync('./test.json'); //Deletes file, fails if not file found
            } catch (err) {}
            done();
        });
    });
    after(function() {
        testInit.close();
        fs.unlinkSync('./test.json'); //Deletes file, fails if not file found
    });
    it('Check polls', function(done) {
        dbHandler.checkPoll(poll).should.be.true();
        var testPoll = dbHandler.getPoll(poll);
        testPoll.should.be.an.Array();
        should.exist(testPoll[0]);
        should.exist(testPoll[0].question);
        should.exist(testPoll[0].options);
        should.exist(testPoll[0].id);
        testPoll = dbHandler.getPoll('test2foo');
        should.not.exist(testPoll);
        dbHandler.checkPoll('test2foo').should.be.false();
        done();
    });
    it('Database Save', function(done) {
        require('../app/dbHandler')(function(handler) {
            should.exist(handler);
            handler.answerQuestion(poll, 1, 0, "mytoken");
            done();
        }, true);
    });
});
