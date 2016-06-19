#!/usr/bin/env node

// Dependencias
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var useragent = require('useragent');
var config = require('./config');

// Configuración
var port = process.env.PORT || 3000;
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Rutas
app.get('/', function(req, res) {
    var agent = useragent.parse(req.headers['user-agent']);
    var value = (agent.toAgent() + "_" + agent.os.toString() + "_" + agent.device.toString()).replace(/\s/g, "");
    res.send(value);
});

app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);