// # Database Handler
// Gestión de la base de datos **Lokijs**
'use strict';
//Desarrollado por la Oficina de Software Libre bajo licencia MIT

// ## Dependencias
// * **Lokijs:** Base de datos no relacional en memoria
var loki = require('lokijs');

// ### Dependencias Locales
// * [**Config**](./config.html): Configuración general de Polleitor
var config = require('./config');

// ## Conexión con Lokijs
module.exports = function(done,save) {
    if(save!==false) save=true;

    // Configuración de lokijs
    var db = new loki(config.loki_db_name, {
        autosave: save,
        autosaveInterval: 1000,
        autoload: true,
        autoloadCallback: loadHandler
    });

    // #### DB Handler
    // Objeto manejador de base de datos:
    var dbHandler = {
        // * **polls:** Array con los nombres (ids) de las polls existentes en la BDD
        polls: [],
        // * **getPoll(poll):** Devuelve un array los datos del poll con el nombre dado, null si no existe el poll
        getPoll: function(poll) {
            if (!this.checkPoll(poll)) return null;
            var res = db.getCollection(poll).data.map(function(q) {
                return {
                    question: q.question,
                    options: q.options,
                    id: q.$loki
                };
            });
            if (!res || res.length === 0) return null;
            else return res;
        },
        /*getQuestion: function(poll, id) {
            var q = db.getCollection(poll).get(id);
            return {
                question: q.question,
                options: q.options,
                id: q.$loki
            };
        },*/
        // * **answerQuestion(poll,id,answer,token):** Responde la pregunta del id dado dnetro del poll. La respuesta será el índice _answer_ de la opción elegida.La respuesta será asignada al token enviado.
        answerQuestion: function(poll, id, answer, token) {
            var coll = db.getCollection(poll);
            var q = coll.get(id);
            if (!coll || !token || !q || q.answers[token] !== undefined || answer < 0 || answer >= q.options.length) return false;
            else {
                q.answers[token] = answer;
                coll.update(q);
                if(save) db.saveDatabase();
                return true;
            }
        },
        /*getAnswers: function(poll, id) {
            if (!this.checkPoll(poll)) return null;
            var question = db.getCollection(poll).get(id);
            if (!question) return null;
            var results = [];
            for (var i = 0; i < question.options.length; i++) {
                results[i] = 0;
            }
            for (i in question.answers) {
                results[question.answers[i]]++;

            }
            return {
                options: question.options,
                answers: results
            };
        },*/
        // * **getAnswersPoll(poll):** Devuelve el poll pedido con las respuestas de este. null si no existe
        getAnswersPoll: function(poll) {
            if (!this.checkPoll(poll)) return null;
            var answers = db.getCollection(poll).data.map(function(question) {
                var results = [];
                for (var i = 0; i < question.options.length; i++) {
                    results[i] = 0;
                }
                for (i in question.answers) {
                    results[question.answers[i]]++;

                }
                return {
                    question: question.question,
                    options: question.options,
                    answers: results,
                    id: question.$loki
                };
            });
            if (!answers || answers.length === 0) return null;
            else return answers;
        },
        // * **checkPoll(poll):** Comprueba si existe el poll dado
        checkPoll: function(poll) {
            if (!poll || !db.getCollection(poll)) return false;
            else return true;
        }
    };


    // Función de carga de base de datos. Creará las colecciónes de la configuración si no existen y leerá el archivo de la BDD
    function loadHandler() {
        console.log("Loading DB: " + config.loki_db_name);
        for (var p in config.polls) {
            var coll = db.getCollection(p);
            if (coll === null) {
                var poll = config.polls[p];
                console.log("Creating poll " + p);
                coll = db.addCollection(p);

                for (var i = 0; i < poll.length; i++) {
                    var quest = poll[i];
                    coll.insert({
                        question: quest.q,
                        options: quest.a,
                        answers: {}
                    });
                }
            } else console.log("Loading poll " + p);
            dbHandler.polls.push(p);
        }
        done(dbHandler);
    }
};

// **Exports:** function(done,save) para desplegar la base de datos
// * done(dbHandler): callback ejecutado tras iniciar la conexión con la base de datos
// * **save:** booleano para indicar si se debe guardar la BDD en un archivo o no (por defecto a _true_)
