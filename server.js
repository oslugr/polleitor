#!/usr/bin/env node

// Dependencias
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var useragent = require('useragent');
var config = require('./config');

// Configuración
var port = process.env.PORT || 3000;
app.set('polleitor', config.secret);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Rutas

app.get('/', function(req, res) {
    // Obtiene useragent con el que se ha hecho la petición
    var agent = useragent.parse(req.headers['user-agent']);
    var value = (agent.toAgent() + "_" + agent.os.toString() + "_" + agent.device.toString()).replace(/\s/g, "");
    res.send(value);
});

app.get('/auth', function(req, res) {
    var agent = useragent.parse(req.headers['user-agent']);
    var value = (agent.toAgent() + "_" + agent.os.toString() + "_" + agent.device.toString()).replace(/\s/g, "");

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