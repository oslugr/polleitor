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
db = new loki('test.json');

// Configuración
var port = process.env.PORT || 3000;
app.set('polleitor', config.secret);
app.set('polls',config.polls );

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// start DB
for ( var p in config.polls ) {
    var this_poll = db.addCollection( p );
    for ( q in config.polls[p] ) {
	console.log(config.polls[p][q]);
	this_poll.insert( config.polls[p][q] );
    }
}

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
