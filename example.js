var dbHandler=require('./app/dbHandler');


dbHandler(function(handler){
//    console.log(JSON.stringify(handler.polls));
    //console.log(handler.getQuestions(handler.polls[0]));
    //console.log(handler.getQuestion(handler.polls[0],2));
    //console.log(handler.answerQuestion(handler.polls[0],2,0,"mytoken"));
    //console.log(handler.getQuestion(handler.polls[0],2));
    console.log(handler.getAnswersPoll(handler.polls[0]));
    console.log(handler.answerQuestion(handler.polls[0],2,0,"mytoken"));
    console.log(handler.getAnswersPoll(handler.polls[0]));
    console.log(handler.checkPoll("pepe"));
    console.log(handler.checkPoll(handler.polls[0]));
});
