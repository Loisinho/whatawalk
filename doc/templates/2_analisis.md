# Análisis: Requerimientos del sistema

## Descripción general

La aplicación mostrará una vista inicial con una presentación, descripción y tareas que se pueden realizar en ella. El usuario deberá resgistrarse con unos datos válidos para poder iniciar sesión y poder acceder a todas las funcionalidades de las que dispone. Una vez iniciada la sesión, el cliente puede empezar a buscar información sobre destinos, encontrar otros usuarios, ver los perfiles y seguir sus publicaciones además de crear y unirse a grupos junto a otros usuarios donde poder planificar los viajes.
Dentro de estos grupos existen dos tipos de usuarios, los administradores y los usuarios estandar. Cuando se crea un nuevo grupo, el cliente que lo crea es administrador por defecto, y estos tienen acceso a todas las funciones dentro del grupo. Pueden editarlo al completo, desde decidir que sea público o privado, invitar, expulsar, hasta convertir a otros usuarios normales en administradores. Los demás usuarios del grupo únicamente tendrán acceso al chat grupal y a la información general del grupo además de poder decidir cuando abandonarlo.
Cada usuario tiene su propio perfíl el cual gestiona y edita. En el que se muestra información personal acerca del usuario así como las publicaciones que haya compartido. Los usuarios pueden seguirse entre ellos para estar al tanto de las novedades que se comparten en la aplicación. Finalmente, el usuario puede decidir eliminar manualmente cada una de las aportaciones que ha hecho o eliminar todo rastro al borrar la cuenta desde la edición del perfil.

## Funcionalidades

|FUNCIÓN|ENTRADA|SALIDA|
| --- | --- | --- |
|Registro|`email`, `nick`, `contraseña`|`res`|
|Acceso|`email` o `nick`, `contraseña`|`res`|
|Editar perfil|`id_usuario`, `nombre`, `ubicación`, `descripción`, `imagen`|`perfil`|
|Borrar cuenta|`id_usuario`|`res`|
|Crear publicación|`imagen`, `texto`|`publicación`|
|Buscar grupos|`id_usuario` o `patrón`|`grupos`|
|Unirse a grupo|`id_grupo`, `id_usuario`|`res`|
|Crear grupo|`título`, `privado`|`grupo`|
|Invitar usuario|`id_grupo`, `id_usuario`|`res`|
|Buscar destino|`patrón`|`destino`|
|Buscar lugares|`destino` o `coordenadas`|`lugares`|
|Añadir viaje|`id_grupo`, `destino`, `itinerario`|`res`|
|Enviar mensaje|`id_usuario`, `mensaje`|`res`|
|Buscar usuarios|`id_usuario`, `patrón`|`usuarios`|
|Seguir usuario|`id_usuario1`, `id_usuario2`|`res`|

- Registro

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`email`|String|Email del usuario|
|`nick`|String|Nick elegido por el usuario|
|`contraseña`|String|Contraseña escrita por el usuario|
|`res`|String|Frase con la confirmación o el error|

- Acceso

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`email`|String|Email del usuario|
|`nick`|String|Nick del usuario|
|`contraseña`|String|Contraseña asociada a la cuenta|
|`res`|String|Frase con la confirmación o el error|

- Editar perfil

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario`|String|Id del usuario|
|`nombre`|String|Nombre del usuario|
|`ubicación`|String|Ubicación del usuario|
|`descripción`|String|Descripción del usuario|
|`imagen`|String|Images subida del usuario|
|`perfil`|Object|Datos actualizados del perfíl|

- Borrar cuenta

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario`|String|Id del usuario|
|`res`|String|Confirmación o error|

- Crear publicación

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`imagen`|String|Imagen de la publicación|
|`texto`|String|Texto de la publicación|
|`publicación`|Object|Publicación resulatado|

- Buscar grupos

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario`|String|Id del usuario|
|`patrón`|String|Expresión de búsqueda|
|`grupos`|Array|Listado con los grupos|

- Unirse a grupo

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_grupo`|String|Id del grupo|
|`id_usuario`|String|Id del usuario|
|`res`|String|Confirmación o error|

- Crear grupo

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`título`|String|Título del grupo|
|`privado`|Boolean|Decisión entre grupo público o privado|
|`grupo`|Object|Grupo resultado|

- Invitar usuario

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_grupo`|String|Id del grupo|
|`id_usuario`|String|Id del usuario|
|`res`|String|Confirmación o error|

- Buscar destino

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`patrón`|String|Expresión de búsqueda|
|`destino`|Object|Destino encontrado|

- Buscar lugares

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`destino`|String|Id del destino|
|`coordenadas`|Object|Latitud y longitud|
|`lugares`|Array|Lugares encontrados|

- Añadir viaje

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_grupo`|String|Id del grupo|
|`destino`|Objeto|Datos del destino|
|`itinerario`|Array|Conjunto de lugares|
|`res`|String|Confirmación o error|

- Enviar mensaje

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario`|String|Id del usuario|
|`mensaje`|String|Texto|
|`res`|String|Confirmación o error|

- Buscar usuarios

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario`|String|Id del usuario|
|`patrón`|String|Expresión de búsqueda|
|`usuarios`|Array|Conjunto de usuarios resultado|

- Seguir usuario

|DATO|TIPO DE DATO|DESCRIPCIÓN|
| --- | --- | --- |
|`id_usuario1`|String|Id del usuario que sigue|
|`id_usuario2`|String|Id del usuario que es seguido|
|`res`|String|Confirmación o error|

## Requerimientos de desarrollo

El desarrollo de la aplicación será llevada a cabo por un único programador y para el desarrollo de la aplicación es necesario un equipo de trabajo, en este caso un ordenador portátil con un procesador i5 de sexta generación y 8 GB de memoria RAM con Windows 10 como sistema operativo.
En cuanto al software necesario, se hace uso de:
- **Visual Studio Code** (versión 1.46.0) como editor de texto.
- **Google Chrome** (versión 78.0.3904.130) como navegador web.
- **Node.js** (v12.16.3) para el entorno de desarrollo del servidor.
- **MongoDB** (v4.2.5) de sistema de base de datos.
- **Webpack** (v4.42.1) para la transformación de los módulos de la parte front-end.
También es necesario tener un servidor web para montar la aplicación web en el momento de ponerla en producción. Para este cometido se emplea como proveedor el servicio de [Google Cloud](https://cloud.google.com/) con una máquina *n1-standard-1* (1vCPU y 3,75 GB de memoria). Además de ser necesario un dominio personalizado.
La aplicación hará uso de fuentes del directorio de Google Fonts y también de una API ofrecida por [Triposo](https://www.triposo.com/), gratuita en un primer momento, pero limitada en uso.

## Normativa

La aplicación web consta en su mayoría de información pública, en la que se incluye la información del perfil de cada usuario y cierta información sobre sus publicaciones y grupos públicos. Por lo tanto la web deberá cumplir con la normativa de protección de datos vigente de los territorios en los que va a operar. En este caso, la aplicación web está pensada para su uso internacionalmente, por lo que sería necesario revisar la normativa de cada país. Pero como comienzo, la aplicación cuenta con un apartado sobre estas políticas, con las que se cumple con la [Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673) española y la [General Data Protection Regulation (GDPR)](https://eur-lex.europa.eu/eli/reg/2016/679/oj).

## Planificación

|ETAPA|INICIO|FIN|DURACIÓN|
| --- | --- | --- | --- |
|Estudio preliminar|23/03/2020|30/03/2020|7 días|
|Análisis|23/03/2020|30/03/2020|7 días|
|Diseño|23/03/2020|30/03/2020|7 días|
|Codificación y pruebas|23/03/2020|30/03/2020|7 días|

|TAREA #1|Estudio de la idea|
| --- | ---|
|Descripción|Estudio inicial de la idea a desarrollar|
|Duración| 4 días|

|TAREA #2|Requerimientos|
| --- | ---|
|Descripción|Información sobre los usos de la aplicación|
|Duración| 3 días|

|TAREA #3|Funcionalidades|
| --- | ---|
|Descripción|Desarrollo de las funcionalidades del proyecto|
|Duración| 4 días|

|TAREA #4|Requerimientos de desarrollo|
| --- | ---|
|Descripción|Requerimientos hardware y software específicos para la aplicación|
|Duración| 3 días|

|TAREA #5|Diseño de la base de datos|
| --- | ---|
|Descripción|Modelos Entidad/Relación y relacional de las funciones a implementar|
|Duración| 2 días|

|TAREA #6|Mockup|
| --- | ---|
|Descripción|Diseño de las principales vistas de la aplicación|
|Duración| 5 días|

|TAREA #7|Codificación|
| --- | ---|
|Descripción|Etapa de codificación de la aplicación|
|Duración| 6 días|

|TAREA #8|Pruebas|
| --- | ---|
|Descripción|Realización de tests y pruebas del pleno funcionamiento de la aplicación|
|Duración| 1 día|

## Estimación de coste inicial

El coste inicial de la aplicación está pensado para un tiempo de desarrollo de 3 semanas empleando 6 horas por día.

- Inentario:

|DESCRIPCIÓN|TIPO DE RECURSO|PRECIO UNITARIO|CANTIDAD|PRECIO TOTAL|
| --- | --- | --- | --- | --- |
|Equipo informático|Harware|899€/ud.|1 ud.|899€|
|Windows 10 Home|Software|0€/ud.|1 ud.|0€|

- Costes directos de desarrollo:

|DESCRIPCIÓN|TIPO DE RECURSO|PRECIO UNITARIO|CANTIDAD|PRECIO TOTAL|
| --- | --- | --- | --- | --- |
|Servidor Web|Servicio|23,98€/mes|1 mes|23,98€|
|Dominio|Servicio|1€/año|1 año|1€|
|Visual Studio Code|Software|0€/ud.|1 ud.|0€|
|Node.js|Software|0€/ud.|1 ud.|0€|
|MongoDB|Software|0€/ud.|1 ud.|0€|

- Costes indirectos de desarrollo:

|DESCRIPCIÓN|TIPO DE RECURSO|PRECIO UNITARIO|CANTIDAD|PRECIO TOTAL|
| --- | --- | --- | --- | --- |
|Equipo informático|Harware|0.25€/h|106h|26,50€|
|Consumo energético|Servicio|0.10€ KW/h|0.2 KW/h en 106h|2,12€|
|Tarifa de internet|Servicio|30€ €/mes|1 mes|30€|

- Mano de obra:

|DESCRIPCIÓN|TIPO DE RECURSO|PRECIO UNITARIO|CANTIDAD|PRECIO TOTAL|
| --- | --- | --- | --- | --- |
|Programador|Personal|14€/h|106h|1 484€|

- Coste total:

|DESCRIPCIÓN||PRECIO|
| --- | --- |
|Inentario|899€|
|Costes directos de desarrollo|24,98€|
|Costes indirectos de desarrollo|58,62€|
|Mano de obra|1 484€|
||2 476,60€|

- Costes de mantenimiento:

|DESCRIPCIÓN|TIPO DE RECURSO|PRECIO UNITARIO|CANTIDAD|PRECIO TOTAL|
| --- | --- | --- | --- | --- |
|Programador|Personal|14€/h|480h|6720€|
|Servidor Web|Servicio|23,98€/mes|12 meses|287,76€|
|Dominio|Servicio|10€/año|1 año|10€|
|||||7017,76€|

## Bibliografía y referencias.

- [Visual Studio Code](https://code.visualstudio.com/)
- [Google Chrome](https://www.google.com/intl/es_es/chrome/)
- [Node.js](https://nodejs.org/es/)
- [MongoDB](https://www.mongodb.com/)
- [Webpack](https://webpack.js.org/)
- [Google Cloud](https://cloud.google.com/)
- [Triposo](https://www.triposo.com/)
