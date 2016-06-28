var loki = require('lokijs');
var config = require('./config');


module.exports = function(done,save) {
    if(save!==false) save=true;

    var db = new loki(config.loki_db_name, {
        autosave: save,
        autosaveInterval: 1000,
        autoload: true,
        autoloadCallback: loadHandler
    });

    //Using $loki for question id
    var dbHandler = {
        polls: [],
        getPoll: function(poll) {
            if (!this.checkPoll(poll)) return null;
            var res = db.getCollection(poll).data.map(function(q) {
                return {
                    question: q.question,
                    options: q.options,
                    id: q.$loki
                };
            });
            if (!res || res.length === 0) return null;
            else return res;
        },
        /*getQuestion: function(poll, id) {
            var q = db.getCollection(poll).get(id);
            return {
                question: q.question,
                options: q.options,
                id: q.$loki
            };
        },*/
        answerQuestion: function(poll, id, answer, token) {
            var coll = db.getCollection(poll);
            var q = coll.get(id);
            if (!coll || !token || !q || q.answers[token] !== undefined || answer < 0 || answer >= q.options.length) return false;
            else {
                q.answers[token] = answer;
                coll.update(q);
                if(save) db.saveDatabase();
                return true;
            }
        },
        /*getAnswers: function(poll, id) {
            if (!this.checkPoll(poll)) return null;
            var question = db.getCollection(poll).get(id);
            if (!question) return null;
            var results = [];
            for (var i = 0; i < question.options.length; i++) {
                results[i] = 0;
            }
            for (i in question.answers) {
                results[question.answers[i]]++;

            }
            return {
                options: question.options,
                answers: results
            };
        },*/
        getAnswersPoll: function(poll) {
            if (!this.checkPoll(poll)) return null;
            var answers = db.getCollection(poll).data.map(function(question) {
                var results = [];
                for (var i = 0; i < question.options.length; i++) {
                    results[i] = 0;
                }
                for (i in question.answers) {
                    results[question.answers[i]]++;

                }
                return {
                    question: question.question,
                    options: question.options,
                    answers: results,
                    id: question.$loki
                };
            });
            if (!answers || answers.length === 0) return null;
            else return answers;
        },
        checkPoll: function(poll) {
            if (!poll || !db.getCollection(poll)) return false;
            else return true;
        }
    };

    function loadHandler() {
        console.log("Loading DB: " + config.loki_db_name);
        for (var p in config.polls) {
            var coll = db.getCollection(p);
            if (coll === null) {
                var poll = config.polls[p];
                console.log("Creating poll " + p);
                coll = db.addCollection(p);

                for (var i = 0; i < poll.length; i++) {
                    var quest = poll[i];
                    coll.insert({
                        question: quest.q,
                        options: quest.a,
                        answers: {}
                    });
                }
            } else console.log("Loading poll " + p);
            dbHandler.polls.push(p);
        }
        done(dbHandler);
    }

};
//var test = db.getCollection('polls');
//console.log(test.get(1));


/*
encuesta:{
    poll1:{
        id: 
        question: string,
        options: [string],
        answers: {
            token1:option,
            token2: option2
        }
},
    poll2:{
        ...
    }
}*/
