# Polleitor
[![Build Status](https://travis-ci.org/oslugr/polleitor.svg?branch=master)](https://travis-ci.org/oslugr/polleitor)
[![Coverage Status](https://coveralls.io/repos/github/oslugr/polleitor/badge.svg?branch=master)](https://coveralls.io/github/oslugr/polleitor?branch=master)

Sistema cliente-servidor para crear widgets de encuestas


## Api
Se accede al servicio mediante una Api Rest

|**Método**|**Ruta**    |**Descripción**|**Resultado**|
|:--------:|:----------:|:-------------:|:-----------:|
|GET       |`:id`       |Genera y devuelve token de sesion|`{success,message,tokens}`|
|GET       |`:id/check` |Comprobación de la id generada|Id en texto plano|
|GET       |`:token/:id/:respuesta`||||
