module.exports = {
    'secret': 'polleitor',
    'loki_db_name': process.env.DBFILE || 'polls.json',
    'polls': {
        "test": [{
            "q": "¿Esto va?",
            "a": ["Si", "No"]
        }, {
            "q": "Segunda del primer poll",
            "a": ["Como", "yiss"]
        }],
        "2test": [{
            "q": "¿Y ahora?",
            "a": ["Si", "No"]
        }]
    }
};
