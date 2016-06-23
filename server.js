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
var dbHandler=require('./app/dbHandler');

// Configuración
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));
app.use(express.static('public'));

dbHandler(function(handler){
routes(app,handler);

app.listen(port, function() {
    console.log('Servidor corriendo en http://localhost:' + port);
});
});
module.exports = app;
