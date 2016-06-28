module.exports = {
    'secret': 'polleitor',
    'loki_db_name': process.env.DBFILE || 'polls.json',
    'polls': {
        "asignatura": [{
            "q": "¿Están bien preparados los alumnos de tu(s) asignatura(s)?",
            "a": ["Si", "No"]
        }]
    }
};
