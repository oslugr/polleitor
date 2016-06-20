#!/usr/bin/env node

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

var routes=require('./app/routes');
var db=require('./app/routes').db;

// Configuración
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));


routes(app);


app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);
module.exports=app;
