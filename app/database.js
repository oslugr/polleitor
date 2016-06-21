var loki = require('lokijs');
var config=require('./config');

var db = new loki('polls.json');


// start DB
var polls_for_db = [];
for (var p in config.polls) {
    var this_poll = db.addCollection(p);
    for (var q in config.polls[p]) {
        this_poll.insert(config.polls[p][q]);
    }
    polls_for_db[p] = this_poll;
}

module.exports={
    db:db,
    polls:polls_for_db
};
