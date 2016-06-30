// # Configuración de polleitor
// Configuración del servidor y polls
'use strict';
//Desarrollado por la Oficina de Software Libre bajo licencia MIT

// **exports**   
// * secret: Pass secreto para gestión de sesiones
// * loki_db_name: Archivo para almacenar la BDD
// * polls: Lista de polls a generar
module.exports = {
    'secret': 'polleitor',
    'loki_db_name': 'polls.json',
    'polls': {
        "asignatura": [{
            "q": "¿Están bien preparados los alumnos de tu(s) asignatura(s)?",
            "a": ["Si", "No"]
        }],
        "TFG": [{
            "q": "¿Alguna vez has pensado que un alumno es incapaz de hacer un TFG de cierta entidad?",
            "a": ["Sí", "No"]
        }]
    }
};
