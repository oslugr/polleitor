var loki = require('lokijs');
var config=require('./config');

var db = new loki(config.loki_db_name);


// start DB
var polls = [];
for (var p in config.polls) {
    var this_poll = db.addCollection(p);
    for (var q in config.polls[p]) {
        this_poll.insert(config.polls[p][q]);
    }
    polls[p] = this_poll;
}

module.exports={
    db:db,
    polls:polls
};
