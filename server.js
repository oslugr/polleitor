#!/usr/bin/env node

'use strict';

// Dependencias
var config = require('./app/config');

var express = require('express');
var session = require('express-session');
var app = express();
var sessionOptions = {
    secret: config.secret,
    resave: true,
    saveUninitialized: false
};

var bodyParser = require('body-parser');
var morgan = require('morgan');

var routes = require('./app/routes');

// Configuración
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));
app.use(express.static('public'));

routes(app);

app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);
module.exports = app;
