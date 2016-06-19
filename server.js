#!/usr/bin/env node

// Dependencias
var config = require('./config');

var express = require('express');
var session = require('express-session');
var app = express();
var sessionOptions = {
    secret: config.secret,
    resave: true,
    saveUninitialized: false
};
var session;

var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var useragent = require('useragent');

var loki = require('lokijs'),
    db = new loki('test.json');

// Configuración
var port = process.env.PORT || 3000;
app.set('polleitor', config.secret);
app.set('polls', config.polls);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));

// start DB
for (var p in config.polls) {
    var this_poll = db.addCollection(p);
    for (q in config.polls[p]) {
        console.log(config.polls[p][q]);
        this_poll.insert(config.polls[p][q]);
    }
}

// Rutas
app.get('/:id', function(req, res) {
    session = req.session;

    var agent = useragent.parse(req.headers['user-agent']);
    var value = ("ID:" + req.params.id + "_" + agent.toAgent() + "_" + agent.os.toString() + "_" + agent.device.toString()).replace(/\s/g, "");

    // Crea el token
    var token = jwt.sign(value, app.get('polleitor'));
    session.token = token;

    res.json({
        success: true,
        message: 'Token creado',
        token: token
    });
});

// Rutas protegidas
var api = express.Router();
app.use('/:id', api);

// Middleware para verficiar el token
api.use(function(req, res, next) {
    // Obtener el token
    session = req.session;

    // Verificar el token
    if (session.token) {
        jwt.verify(session.token, app.get('polleitor'), function(err, value) {
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