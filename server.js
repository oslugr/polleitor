// # Main app
// Servidor principal de **Polleitor**
'use strict';
//Desarrollado por la Oficina de Software Libre bajo licencia MIT


// ## Dependencias
// * **Express:** Framework web
//   * **Express session:** Middleware de gestión de sesiones con express
//   * **body-parser:** Middleware para gestionar el _body_ de las peticiones
// * **Morgan:** Logger de peticiones para el servidor

var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

// ### Dependencias locales
// * [**Config**](./config.html): Configuración general de Polleitor
// * [**Routes**](./routes.html): Rutas y API de Polleitor
// * [**DBHandler**](./dbHandler.html): Manejador de la base de datos

var config = require('./app/config');
var routes = require('./app/routes');
var dbHandler = require('./app/dbHandler');

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
// * **Morgan:** Configurado en modo desarrollo (dev)
// * **Session:** Opciones de sesiones
// * **Static:** Carpeta `public` como carpeta para servir archivos estáticos

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session(sessionOptions));
app.use(express.static('public'));


// Despliegue del servidor y base de datos
dbHandler(function(handler) {
    routes(app, handler);

    app.listen(port, function() {
        console.log('Servidor corriendo en http://localhost:' + port);
    });
});

// **Exports:** app
module.exports = app;
