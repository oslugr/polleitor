#!/usr/bin/env node

// Dependencias
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var useragent = require('useragent');
var config = require('./config');


var loki = require('lokijs'),
db = new loki('polls.json');

// Configuración
var port = process.env.PORT || 3000;
app.set('polleitor', config.secret);
app.set('polls',config.polls );
app.set('loki',db);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// start DB
var polls = new Array();
for ( var p in config.polls ) {
    var this_poll = db.addCollection( p );
    for ( q in config.polls[p] ) {
	this_poll.insert( config.polls[p][q] );
    }
    polls[p] = this_poll;
}
app.set('these_polls',polls );

// Rutas
app.get('/:id', function(req, res) {
    if ( typeof polls[req.params.id] === 'undefined' ) {
	res.status(404).send('ID ' + req.params.id + ' not found');	
    } else {
	var agent = useragent.parse(req.headers['user-agent']);
	var dev_id =  agent.toAgent() 
	    + "_" + agent.os.toString() + "_" 
	    + agent.device.toString().replace(/\s/g, "");
	var value = "ID:"+req.params.id + "_" + dev_id;
	
	// Crea el token
	var token = jwt.sign(value, app.get('polleitor'));
	
	var poll_collection = app.get('these_polls')[req.params.id];
	poll_collection.insert( { dev_id: dev_id,
				  token: token } );
	db.saveDatabase();
	res.json({
            success: true,
            message: 'Token creado',
            token: token
	});
    }
});

app.get('/:token/:id/:respuesta', function(req, res) {
    if ( typeof polls[req.params.id] === 'undefined' ) {
	res.status(404).send('ID ' + req.params.id + ' not found');	
    } else {
	var poll_collection = app.get('these_polls')[req.params.id];
	console.log( req.params.token );
	var dev_id = poll_collection.find( { 'token': req.params.token } );
	res.json({success: true,
		  message: 'token correcto'});
    }
});

app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);
