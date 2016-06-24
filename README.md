# Polleitor

[![Build Status](https://travis-ci.org/oslugr/polleitor.svg?branch=master)](https://travis-ci.org/oslugr/polleitor)

[![Coverage Status](https://coveralls.io/repos/github/oslugr/polleitor/badge.svg?branch=master)](https://coveralls.io/github/oslugr/polleitor?branch=master)

Sistema cliente-servidor para crear widgets de encuestas.

## API

Se accede al servicio mediante una API REST

| **Método** | **Ruta**                | **Descripción**                        | **Resultado**                  |
|:----------:|:-----------------------:|:--------------------------------------:|:------------------------------:|
| GET        | `:id`                   | Devuelve las preguntas de una encuesta | `{questions}`                  |
| PUT        | `:token/:id/:respuesta` | Añade respuesta a la pregunta          | `{status, ok, poll, pregunta}` |
