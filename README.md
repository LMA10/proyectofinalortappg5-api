# Ciudades Inteligentes API (Indicadores - KPI)

Este repositorio esta dedicado al desarrollo de la api del intituto ciudades inteligentes

## Descripcion

Esta API es parte del trabajo de la materia proyecto final del instituto ORT 2021.
Su objetivo es comunicarse con la API de Orion Context Broker (Fiware) y generar un historico 
a partir de las ultimas operaciones CRUD realizadas sobre la misma. 


## Funcionalidades / Casos de uso

- Registrar usuario
- Loguear usuario
- ABM usuarios
- ABM municipios
- ABM Ejes
- ABM Sub ejes
- ABM indicadores
- Sumatoria del promedio de indicadores / Metas
- Historial de cambios realizados sobre los indicadores

## Entidades principales

- Users
- Roles
- Indicators

## Instrucciones tecnicas

Instalar [NodeJS](https://nodejs.org) (14.17.0) o superior

Una vez dentro del proyecto, instalar el Node Package Manager

```bash
npm install
```
El proyecto utiliza [mongodb](https://www.mongodb.com) por lo tanto, si de desea utilizar este mismo esquema
se debe generar un archivo ".env" para declarar las variables globales de mongo como se muestra en el siguiente codigo a modo de ejemplo:

```bash
MONGO_URI= mongodb+srv://usuario:contraseña@cluster054.dms7r3.mongodb.net/dbname?retryWrites=true&w=majority
SECRET=miPalabraSecreta
URL_VM_ORION=direccionIpMaquinaVirtual
```

En nuestro archivo connection.js

```bash
const uri = process.env.MONGO_URI
```

Luego dentro de nuesta ruta fiware.js

```bash
const conVM = process.env.URL_VM_ORION;
```

Por ultimo, para trabajar con los tokens dentro de nuestros esquemas:

```bash
const tokenPass = process.env.SECRET;
```

## Listado Endpoints (Swagger)

URL: https://proyecto-final-ort-api.herokuapp.com/doc/

## Contribuyendo
Las pull requests son bienvenidas. Para cambios importantes, primero abra un problema para discutir lo que le gustaría cambiar..
Por ultimo, si le interesa ser parte del proyecto, no dude en solicitar las credenciales para su archivo .env

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contactos
- leonardoadamini@gmail.com
- sebastian.cea@ort.edu.ar
