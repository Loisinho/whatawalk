# What A Walk

### A travel web application designed for groups.

### IES San Clemente web development final project by Diego Lois.

*Documentation in Spanish*

# Proxecto de fin de ciclo DAW

## Descripción

**What A Walk** es una aplicación web diseñada especialmente para grupos. La aplicación aporta un único punto donde reunir toda la información, datos, itinerarios así como destinos y rutas sobre el viaje que se desea llevar a cabo con un grupo de personas, ya sean amigos, familiares o usuarios de la propia aplicación a los que acabas de conocer. Tanto los usuarios que piensan realizar el viaje como la información de este se guardan en un grupo creado especialmente para ello, el cual dispone de chat en tiempo real, es personalizable y reutilizable para futuras ocasiones. Además, la web, es un lugar perfecto para compartir publicaciones con información, opiniones e images sobre los destinos que se han visitado y así ayudar al resto de la comunidad de viajeros dentro de la aplicación, o por otro lado, ver aquellas que han publicado otros usuarios para decidir la próxima aventura.

## Instalación

La aplicación está desarrollada en un entorno Node JavaScript (versión estable v12.16.3), junto con el sistema de base de datos NoSQL de MongoDB (v4.2.5), los cuales abrá que tener instalados previamente.
Luego, el directorio principal de la aplicación contiene dos subdirectorios: uno para la parte front-end y otro para el servidor o back-end.

Primero debemos entrar en el directorio [client](https://github.com/Loisinho/whatawalk/tree/master/client) e instalar los paquetes necesarios para su funcionamiento:
```
cd ./client/
npm install
```
Luego ejecutaremos uno de los siguientes comandos para montar los archivos que se servirán en nuestro navegador:
```
npm run dev
npm run dev-server
npm run build
```
*Cada uno monta los archivos de una forma distinta, **dev** incluirá código de ayuda para el momento de desarrollar, **dev-server** creará un servidor local y **build** montará archivos listos para producción.*

Una vez montados, entraremos en el directorio [server](https://github.com/Loisinho/whatawalk/tree/master/server) e instalaremos sus paquetes:
```
cd ./server/
npm install
```
Y ejecutamos uno de los siguientes comandos para iniciar el servidor:
```
npm run start
npm run dev
npm forever
```
*El uso de algunos comandos dependen de paquetes que deben estar instaladas. Estos son **npm run dev** y **npm run forever**, que hacen uso de [nodemon](https://www.npmjs.com/package/nodemon) y [forever](https://www.npmjs.com/package/forever) respectivamente.*

## Uso

Para hecer uso total de lo que ofrece la aplicación habrá que registrarse en la web aportando unos pocos datos tales como nombre de usuario y contraseña. Y una vez se inicia sesión, están disponibles todas las funcionalidades de la web. Por ejemplo, la creación de grupos, búsqueda de viajes y ver o subir publicaciones.

## Sobre el autor

Me llamo Diego Lois, soy natural de Santiago de Compostela y me dedico al desarrollo de aplicaciones web.

Me considero un desarrollador full-stack especializado en:
- JavaScript
    - ES6
    - Node.js
    - Vue.js
- HTML
    - HTML5
    - PUG
- CSS
    - SCSS
- MONGODB
- MYSQL
Y con amplios conocimientos en:
- PHP
- Python
- C/C++
- Java

La idea de este proyecto surgió de mi afición por viajar y conocer las diferentes culturas del mundo junto a mi familia y amigos, los cuales no siempre están cerca para planificar los viajes.

Para encontrarme contáctame en:
- diegolois96@gmail.com
- [@DiegoLois7](https://twitter.com/DiegoLois7) en Twitter
- [Loisinho](https://github.com/Loisinho) en GitHub

## Licencia

Este proyecto se encuentra bajo la [licencia MIT](https://github.com/Loisinho/whatawalk/blob/master/LICENSE).

## Guía de contribución

Este proyecto permite la colaboración mediante Forks del repositorio. Con los últimos cambios, crea una rama, añade nuevas funcionalidades, corrige u optimiza el código, etc. Finalmente realiza un Pull Request a este repositorio.

## Memoria

1. [Estudio preliminar](doc/templates/1_estudio_preliminar.md)
2. [Análisis: Requerimientos del sistema](doc/templates/2_analisis.md)
3. [Diseño](doc/templates/3_diseño.md)
4. [Codificación y Pruebas](doc/templates/4_codificacion_probas.md)

#### Anexos
1. [Referencias](doc/templates/a1_referencias.md)
