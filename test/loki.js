// # Test - Base de Datos
// Tests sobre la base de datos LokiJS usando mocha

//Desarrollado por la Oficina de Software Libre bajo licencia MIT


// ## Dependencias
// * **Should:** Módulo de aserciones de estilo BDD
// * **Fs:** Módulo nativo de gestión del sistema de ficheros
// * **Supertest-session:** Módulo de conexiones HTTP con sesiones para tests.
var should = require('should');
var fs = require('fs');
var supertest = require('supertest-session');

// ### Dependencias locales
// * [**Config**](../config.html): Configuración general de Polleitor
//   * Modificación en `loki_db_name`
// * [**Test Init**](./init.html): Inicialización de servidor de prueba
var config = require('../app/config');
config.loki_db_name = "test.json";
var testInit = require('./init');

// ## Configuración

// * loki_db_name: `test.json`
//   * Nombre del archivo para almacenar la base de datos
// * poll: Configuración del Poll a usar de pruebas
var poll = Object.keys(config.polls)[0];


// ## Pruebas de la Base de datos Loki

// Pruebas sobre la interfaz de la base de datos
// * _before:_ Inicia el servidor y base de datos, elimina fichero de prueba si existe
// * _after:_ Cierra el servidor y elimina el archivo de la base de datos de prueba
describe('Loki', function() {
    var app;
    var dbHandler;
    var request;
    before(function(done) {
        try {
            fs.unlinkSync('./test.json'); //Deletes file, fails if not file found
        } catch (err) {}
        testInit.init(function(app2, handler) {
            should.exist(app2);
            should.exist(handler);
            app = app2;
            dbHandler = handler;
            request = supertest(app);

            done();
        });
    });
    after(function() {
        testInit.close();
        try {
            fs.unlinkSync('./test.json');
        } catch (err) {}
    });
    // * **Check polls:** Comprueba que los polls se han generado correctamente y el funcionamiento de checkPoll
    it('Check polls', function(done) {
        dbHandler.checkPoll(poll).should.be.true();
        var testPoll = dbHandler.getPoll(poll);
        testPoll.should.be.an.Array();
        should.exist(testPoll[0]);
        should.exist(testPoll[0].question);
        should.exist(testPoll[0].options);
        should.exist(testPoll[0].id);
        testPoll = dbHandler.getPoll('test2foo');
        should.not.exist(testPoll);
        dbHandler.checkPoll('test2foo').should.be.false();
        done();
    });
    // * **Database Save:** Comprueba que se genera el fichero de la base de datos
    it('Database Save', function(done) {
        require('../app/dbHandler')(function(handler) {
            should.exist(handler);
            handler.answerQuestion(poll, 1, 0, "mytoken");
            //TODO: comprobar que el fichero es correcto
            setTimeout(function() {
                try {
                    fs.unlinkSync('./test.json'); //Borra el fichero, falla si no existe
                } catch (err) {
                    should.not.exist(err);
                }
                done();
            }, 500);
        }, true);
    });
});
