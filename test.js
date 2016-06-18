#!/usr/bin/env node

var fs= require('fs'),
loki = require('lokijs'),
db = new loki('test.json');


var polls_config = process.argv[2]?process.argv[2]:"polls.json";

var polls = JSON.parse(fs.readFileSync(polls_config,'utf8') );

for ( var p in polls ) {
    var this_poll = db.addCollection( p );
    for ( q in polls[p] ) {
	console.log(polls[p][q]);
	this_poll.insert( polls[p][q] );
    }
}

db.saveDatabase();

