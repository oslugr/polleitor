var loki = require('lokijs');
var config = require('./config');

var db = new loki(config.loki_db_name);


// start DB
var polls = [];
for (var p in config.polls) {
    var poll_collection = db.addCollection(p);
    for (var q in config.polls[p]) {
        poll_collection.insert({
            'poll': config.polls[p][q]
        });
    }
    polls[p] = {
        db_collection: poll_collection,
        poll: config.polls[p]
    };
}

module.exports = {
    db: db,
    polls: polls
};
