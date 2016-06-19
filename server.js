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
    polls.push( this_poll);
}
app.set('these_polls',polls );

// Rutas
app.get('/:id', function(req, res) {
    var agent = useragent.parse(req.headers['user-agent']);
    var value = ("ID:"+req.params.id + "_" + agent.toAgent() + "_" + agent.os.toString() + "_" + agent.device.toString()).replace(/\s/g, "");

    // Crea el token
    var token = jwt.sign(value, app.get('polleitor'));

    res.json({
        success: true,
        message: 'Token creado',
        token: token
    });
});

app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);
