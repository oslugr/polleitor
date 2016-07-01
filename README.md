# Polleitor
_Version 0.3_
[![Build Status](https://travis-ci.org/oslugr/polleitor.svg?branch=master)](https://travis-ci.org/oslugr/polleitor)
[![Coverage Status](https://coveralls.io/repos/github/oslugr/polleitor/badge.svg?branch=master)](https://coveralls.io/github/oslugr/polleitor?branch=master)

Sistema cliente-servidor para crear widgets de encuestas.

La parte servidor usa LokiDB para almacenar las encuestas y
resultados y funciona con REST, la parte cliente JavaScript para
configurar las encuestas y enviar los resultados.

La configuración se hace en el servidor y en él se almacenan los
resultados.

## Instalación

Tras clonar de este repo:
```bash
npm install
```

Ejecutar Tests (opcional):
```bash
npm test
```

Iniciar servidor:
```bash
npm start
```

Menú Principal de Polleitor en http://localhost:3000 y listo.

Si usas [Heroku](http://heroku.com), cambia `repository` en el fichero
de configuración `app.json` y

    heroku login
	heroku git:remote -a mi-proyecto-en-heroku
	git push heroku master




## API

Se accede al servicio mediante una API REST

| **Método** | **Ruta**           | **Descripción**                        | **Resultado**                  |
|:----------:|:------------------:|:--------------------------------------:|:------------------------------:|
| GET        |`:poll`             | Devuelve las preguntas de una encuesta |`[{question,options,id}]`       |
| GET        |`:poll/resultados`  | Resultados del poll                    |`[{question,options,id,answers}]`|
| PUT        |`:poll`             | Responde al poll [{id,answer}]         |`{poll,updates,failedUpdates}`  |
