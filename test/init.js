// # Init Tests
// Inicialización de servidor para pruebas
'use strict';
//Desarrollado por la Oficina de Software Libre bajo licencia MIT

// ## Dependencias
// * **Express:** Framework web
//   * **Express session:** Middleware de gestión de sesiones con express
//   * **body-parser:** Middleware para gestionar el _body_ de las peticiones
var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');

// ### Dependencias locales
// * [**Config**](../config.html): Configuración general de Polleitor
// * [**Routes**](../routes.html): Rutas y API de Polleitor
// * [**DBHandler**](../dbHandler.html): Manejador de la base de datos
var config = require('../app/config');
var routes = require('../app/routes');
var dbHandler = require('../app/dbHandler');



// ## Configuración

// Opciones de sesiones
var sessionOptions = {
    secret: config.secret,
    resave: true,
    saveUninitialized: false
};

// Puerto (variable de entorno PORT, 3000 por defecto)
var port = process.env.PORT || 3000;

// ## Middlewares
// * **BodyParser:** Configurado para leer jsons
// * **Session:** Opciones de sesiones
// * **Static:** Carpeta `public` como carpeta para servir archivos estáticos
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session(sessionOptions));
app.use(express.static('public'));


var server;

// **Exports**
// * `init(done)` inicializa servidor de base de datos, ejecuta el callback `done(app,handler)`, con la app del servidor y el manejador de la BDD como parámetros
// * `close()` cierra el servidor
module.exports = {
    init: function(done) {
        dbHandler(function(handler) {
            routes(app, handler);
            server = app.listen(port, function() {
                done(app, handler);
            });
        }, false);
    },
    close: function() {
        server.close();
    }
};
