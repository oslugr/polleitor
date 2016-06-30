process.env.DBFILE = "test.json";

var should = require('should');
var config = require('../app/config');
var testInit = require('./init');
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
            done();
        });
    });
    after(function(){
        testInit.close();
    });
    it('Check polls', function(done) {
        should.exist(dbHandler.checkPoll(poll));
        var testPoll=dbHandler.getPoll(poll);
        testPoll.should.be.an.Array();
        should.exist(testPoll[0]);
        should.exist(testPoll[0].question);
        should.exist(testPoll[0].options);
        should.exist(testPoll[0].id);
        testPoll=dbHandler.getPoll('test2foo');
        should.not.exist(testPoll);        
        done();
    });
});
