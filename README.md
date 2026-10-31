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

## Endpoints principales (/classrooms)

- GET /classrooms : Obtiene todas las aulas
- POST /classrooms : Crea un aula (body: {"name": "Nombre", "duenio": "Profesor"})
- GET /classrooms/code/:join_code : Obtiene aula por codigo
- GET /classrooms/:id : Obtiene aula por id
- DELETE /classrooms/:id : Elimina aula por id
