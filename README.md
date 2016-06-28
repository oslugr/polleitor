# Polleitor

[![Build Status](https://travis-ci.org/oslugr/polleitor.svg?branch=master)](https://travis-ci.org/oslugr/polleitor)

[![Coverage Status](https://coveralls.io/repos/github/oslugr/polleitor/badge.svg?branch=master)](https://coveralls.io/github/oslugr/polleitor?branch=master)

Sistema cliente-servidor para crear widgets de encuestas.

La parte servidor usa LokiDB para almacenar las encuestas y
resultados y funciona con REST, la parte cliente JavaScript para
configurar las encuestas y enviar los resultados.

La configuración se hace en el servidor y en él se almacenan los
resultados.

## Instalación

Tras clonar de este repo

	npm install

Seguido, si se desea, por

	npm test

Y a continuación

	npm start

Se va con el navegador a http://localhost:3000/ y listo.


## API

Se accede al servicio mediante una API REST

| **Método** | **Ruta**           | **Descripción**                        | **Resultado**                  |
|:----------:|:------------------:|:--------------------------------------:|:------------------------------:|
| GET        |`:poll`             | Devuelve las preguntas de una encuesta |`[{question,options,id}]`       |
| GET        |`:poll/resultados`  | Resultados del poll                    |`[{question,options,id,answers}]`|
| POST       |`:poll`             | Responde al poll [{id,answer}]         |`{poll,updates,failedUpdates}`  |


