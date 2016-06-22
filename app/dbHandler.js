var loki = require('lokijs');
var config = require('./config');






module.exports = function(done) {
    var db = new loki(config.loki_db_name, {
        autosave: true,
        autosaveInterval: 1000,
        autoload: true,
        autoloadCallback: loadHandler
    });

    //Using $loki for question id
    var dbHandler = {
        polls:[],
        getQuestions:function(poll){
            return db.getCollection(poll).data;
        },
        getQuestion:function(poll,id){
            return db.getCollection(poll).get(id);    
        },
        answerQuestion:function(poll,id,answer,token){
            var coll=db.getCollection(poll);  
            var q=coll.get(id); 
            console.log(q.options.length);
            console.log(q.answers[token]);
            if(!q || q.answers[token]!==undefined || answer>=q.options.length) return false;
            else{
                q.answers[token]=answer;
                coll.update(q);
                return true;                
            }            
        }

    };

    function loadHandler() {
        console.log("Loading DB");
        for(var p in config.polls){
        var coll = db.getCollection(p);
        if (coll === null) {
            var poll=config.polls[p];
            console.log("Creating poll "+p);
            coll = db.addCollection(p);

            for(var i=0;i<poll.length;i++){
                var quest=poll[i];
                coll.insert({
                    question: quest.q,
                    options: quest.a,
                    answers: {}
                });
            }
        } else console.log("Loading poll "+p);
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
