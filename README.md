# Gruplab

Plataforma web para gestion de aulas virtuales para profesores y alumnos.

## Estructura del proyecto

gruplab-fe-be/
- backend: API REST en Node.js, Express y SQL Server
- frontend: Aplicacion web en Angular

## Requisitos

- Node.js (v18 o superior)
- SQL Server

## Backend

1. Entrar a la carpeta backend:
   cd backend

2. Instalar dependencias:
   npm install

3. Configurar variables de entorno en un archivo .env:
   PORT=3000
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_SERVER=tu_servidor
   DB_DATABASE=tu_base_de_datos
   DB_PORT=1433

4. Iniciar el servidor:
   npm run dev

El backend corre en http://localhost:3000

## Frontend

1. Entrar a la carpeta frontend:
   cd frontend

2. Instalar dependencias:
   npm install

3. Iniciar la aplicacion:
   npm start

El frontend corre en http://localhost:4200

## Endpoints de la API

### Aulas (`/classrooms`)
- `GET /classrooms` : Obtiene todas las aulas
- `POST /classrooms` : Crea un aula y registra al profesor en `Members` (`{ "name": "Nombre", "duenio": "Profesor", "email": "..." }`)
- `GET /classrooms/code/:join_code` : Obtiene aula por codigo de acceso
- `GET /classrooms/:id` : Obtiene aula por id
- `DELETE /classrooms/:id` : Elimina aula y sus miembros asociados

### Grupos (`/groups`)
- `GET /classrooms/:classroomId/groups` : Lista los grupos de un aula
- `POST /classrooms/:classroomId/groups` : Crea un grupo en un aula (`{ "project_name": "Proyecto" }`)
- `GET /groups/:id` : Obtiene un grupo por id
- `PUT /groups/:id` : Actualiza el nombre del proyecto del grupo (`{ "project_name": "Nuevo nombre" }`)
- `DELETE /groups/:id` : Elimina un grupo por id

### Miembros (`/members`)
- `GET /classrooms/:classroomId/members` : Lista los miembros de un aula
- `POST /classrooms/:classroomId/members` : Agrega un miembro al aula (`{ "nombre": "Alumno", "email": "...", "rol": "alumno" }`)
- `GET /groups/:groupId/members` : Lista los miembros asignados a un grupo
- `PUT /members/:id/group` : Asigna o quita un miembro de un grupo (`{ "group_id": 1 }` o `null`)
- `DELETE /members/:id` : Libera sus tareas asignadas y elimina al miembro

### Tablero Kanban (`/board` y `/columns`)
- `GET /groups/:groupId/board` : Obtiene columnas y tareas del tablero del grupo (crea las 4 columnas base si esta vacio)
- `POST /groups/:groupId/columns` : Crea una columna en el tablero (`{ "name": "Testing", "color": "info" }`)
- `PUT /columns/:id` : Edita nombre y color de una columna (`{ "name": "...", "color": "..." }`)
- `DELETE /columns/:id` : Elimina una columna y sus tareas
- `PATCH /tasks/:id/column` : Mueve una tarea de columna (`{ "column_id": 2 }`)

### Tareas (`/tasks`)
- `GET /tasks/:id` : Obtiene una tarea por id
- `POST /tasks` : Crea una tarea (`{ "group_id": 1, "column_id": 1, "assigned_to": null, "title": "...", "description": "..." }`)
- `PUT /tasks/:id` : Edita titulo, descripcion y responsable de una tarea (`{ "title": "...", "description": "...", "assigned_to": 1 }`)
- `DELETE /tasks/:id` : Elimina una tarea por id

### Comentarios (`/comments`)
- `GET /tasks/:tareaID/comments` : Lista los comentarios de una tarea
- `POST /comments` : Crea un comentario en una tarea (`{ "tareaID": 1, "autorName": "Nombre", "contenido": "..." }`)
- `PUT /comments/:comentarioID` : Edita un comentario verificando autoria (`{ "autorName": "Nombre", "contenido": "..." }`)
- `DELETE /comments/:comentarioID` : Elimina un comentario verificando autoria (`{ "autorName": "Nombre" }`)
