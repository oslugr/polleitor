// # Configuración de rutas
// Configuración de las rutas de la API de Polleitor
'use strict';
//Desarrollado por la Oficina de Software Libre bajo licencia MIT

// ## Dependencias
// * **jwt:** JSON Web Tokens, para generar los tokens de sesión
// * **Useragent:** Lee el valor _useragent_ para identificar usuarios
// * **Express:** Framework web
var jwt = require('jsonwebtoken');
var useragent = require('useragent');
var express = require('express');

// ### Dependencias locales
// * [**Config**](./config.html): Configuración general de Polleitor
var config = require('./config');

// ## Rutas
module.exports = function(app, handler) {
    // Middleware para crear/verificar el token
    app.use(function(req, res, next) {
        //Obtener el token
        var ses = req.session;

        //Verificar el token, creándolo si no existe
        if (ses.token) {
            jwt.verify(ses.token, config.secret, function(err, value) {
                if (err) {
                    return res.json(403, {
                        success: false,
                        message: 'Failed to verify the token. Unauthorized access.'
                    });
                } else {
                    next();
                }
            });
        } else {
            var agent = useragent.parse(req.headers['user-agent']);
            var dev_id = (agent.toAgent() +
                '_' + agent.os.toString() + '_' +
                agent.device.toString()).replace(/\s/g, '');
            var value = 'ID:' + req.params.id + '_' + dev_id;

            //Crea el token
            var token = jwt.sign(value, config.secret);
            ses.token = token;

            next();
        }
    });
    // Middleware para comprobar que el poll dado existe
    app.use('/:poll', function(req, res, next) {
        var poll = req.params.poll;

        if (!handler.checkPoll(poll)) {
            res.status(404).json({
                error: 'Poll ' + poll + ' not found.'
            });
        } else {
            next();
        }
    });

    // GET `/:poll`: Devuelve las preguntas y posibles respuestas del poll
    app.get('/:poll', function(req, res) {
        var questions = handler.getPoll(req.params.poll);

        if (!questions) {
            return res.status(404).json({
                status: 404,
                error: 'Not poll found.',
                poll: req.params.poll
            });
        } else {
            res.json(questions);
        }
    });

    //GET `/:poll/resultados` Muestra el poll y los resultados
    app.get('/:poll/resultados', function(req, res) {
        var answers = handler.getAnswersPoll(req.params.poll);

        if (!answers) {
            return res.status(404).json({
                error: 'Poll ' + req.params.poll + ' not found.'
            });
        } else {
            return res.json(answers);
        }
    });

    /*app.get('/:poll/p/:f', function(req, res) {
            var token = req.session.token;

            var agent = useragent.parse(req.headers['user-agent']);
            var dev_id = (agent.toAgent() +
                '_' + agent.os.toString() + '_' +
                agent.device.toString()).replace(/\s/g, '');
            var value = 'ID:' + req.params.id + '_' + dev_id;

            var db_collection = req.db_collection; // Código repetido
            db_collection.insert({
                client: {
                    dev_id: dev_id,
                    token: token
                }
            });
            db.saveDatabase();

            console.log(req.params);
            var poll_to_send = {};
            poll_to_send[req.params.id] = req.poll;
            res.header('Content-Type', 'application/javascript');
            res.send(req.params.f + '( ' + JSON.stringify(poll_to_send) + ')');
        });*/

    /*app.put('/:poll/:pregunta/:respuesta', function(req, res) {
        var token = req.session.token;

        var r = handler.answerQuestion(req.params.poll, req.params.pregunta, req.params.respuesta, token);

        if (r) {
            return res.json({
                status: 'OK',
                ok: true,
                poll: req.params.poll,
                pregunta: req.params.pregunta
            });
        } else {
            return res.json({
                status: 'FAIL',
                ok: false,
                poll: req.params.poll,
                pregunta: req.params.pregunta
            });
        }
    });*/

    // PUT `/:poll` responde al poll
    app.put('/:poll', function(req, res) {
        var token = req.session.token;
        var answers = req.body.answers;
        var poll = req.params.poll;

        var correct = 0;
        var incorrect = 0;

        for (var i = 0; i < answers.length; i++) {
            var r = handler.answerQuestion(poll, answers[i].id, answers[i].answer, token);
            if (r) correct++;
            else incorrect++;
        }

        return res.status(200).json({
            poll: req.params.poll,
            updates: correct,
            failedUpdates: incorrect
        });
    });
};

// **Exports:** function(app,handler)
// Función para añadir las rutas a la app express dada junto con el manejador de base de datos _handler_
