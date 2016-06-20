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

var jwt = require('jsonwebtoken');
var useragent = require('useragent');

var db=require('./app/database').db;
var polls=require('./app/database').polls;

// Configuración
var port = process.env.PORT || 3000;
app.set('polleitor', config.secret);
app.set('polls', config.polls);
app.set('loki', db);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));

app.set('these_polls', polls);

// Rutas
app.get('/:id', function(req, res) {
    var ses = req.session;

    if (typeof polls[req.params.id] === 'undefined') {
        res.status(404).send('ID ' + req.params.id + ' not found');
    } else {
        var agent = useragent.parse(req.headers['user-agent']);
        var dev_id = (agent.toAgent() +
            "_" + agent.os.toString() + "_" +
            agent.device.toString()).replace(/\s/g, "");
        var value = "ID:" + req.params.id + "_" + dev_id;

        // Crea el token
        var token = jwt.sign(value, app.get('polleitor'));
        ses.token = token;

        var poll_collection = app.get('these_polls')[req.params.id];
        poll_collection.insert({
            dev_id: dev_id,
            token: token
        });
        db.saveDatabase();

        res.json({
            success: true,
            message: 'Token creado',
            token: token
        });
    }
});

app.get('/:token/:id/:respuesta', function(req, res) {
    if (typeof polls[req.params.id] === 'undefined') {
        res.status(404).send('ID ' + req.params.id + ' not found');
    } else {
        var poll_collection = app.get('these_polls')[req.params.id];
        console.log(req.params.token);
        var dev_id = poll_collection.find({
            'token': req.params.token
        });
        res.json({
            success: true,
            message: 'token correcto'
        });
    }
});

// Rutas protegidas
var api = express.Router();
app.use('/:id', api);

// Middleware para verficiar el token
api.use(function(req, res, next) {
    // Obtener el token
    var ses = req.session;

    // Verificar el token
    if (ses.token) {
        jwt.verify(ses.token, app.get('polleitor'), function(err, value) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Fallo al verificar el token.'
                });
            } else {
                // Se pasa el token con la solicitud
                req.value = value;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'Token no encontrado.'
        });
    }
});

api.get('/check', function(req, res) {
    res.json(req.value);
});

app.listen(port);
console.log('Servidor corriendo en http://localhost:' + port);
module.exports=app;
