CREATE DATABASE GrupLab;

GO
USE GrupLab;

GO
CREATE TABLE Classrooms (
    id        INT           IDENTITY (1, 1) PRIMARY KEY,
    name      VARCHAR (100) NOT NULL,
    duenio    VARCHAR (100) NOT NULL,
    join_code VARCHAR (20)  NOT NULL UNIQUE
);

CREATE TABLE Groups (
    id           INT           IDENTITY (1, 1) PRIMARY KEY,
    classroom_id INT           NOT NULL FOREIGN KEY REFERENCES Classrooms (id) ON DELETE CASCADE,
    group_number INT           NOT NULL,
    project_name VARCHAR (100) NOT NULL,
    UNIQUE (classroom_id, group_number)
);

CREATE TABLE Members (
    id           INT           IDENTITY (1, 1) PRIMARY KEY,
    classroom_id INT           NOT NULL FOREIGN KEY REFERENCES Classrooms (id),
    group_id     INT           NULL FOREIGN KEY REFERENCES Groups (id) ON DELETE SET NULL,
    nombre       VARCHAR (100) NOT NULL,
    email        VARCHAR (100) NULL,
    rol          VARCHAR (20)  DEFAULT 'alumno' NOT NULL,
    created_at   DATETIME      DEFAULT GETDATE()
);
CREATE TABLE BoardColumns (
    id         INT          IDENTITY (1, 1) PRIMARY KEY,
    group_id   INT          NOT NULL FOREIGN KEY REFERENCES Groups (id) ON DELETE CASCADE,
    name       VARCHAR (50) NOT NULL, 
    position   INT          NOT NULL, 
    color      VARCHAR (20) DEFAULT 'secondary' NOT NULL 
);
CREATE TABLE Tasks (
    id          INT            IDENTITY (1, 1) PRIMARY KEY,
    group_id    INT            NOT NULL,
    column_id   INT            NOT NULL FOREIGN KEY REFERENCES BoardColumns (id) ON DELETE CASCADE,
    assigned_to INT            NULL FOREIGN KEY REFERENCES Members (id),
    title       VARCHAR (150)  NOT NULL,
    description VARCHAR (1000) NULL,
    created_at  DATETIME       DEFAULT GETDATE()
);

CREATE TABLE Comments (
    id          INT            IDENTITY (1, 1) PRIMARY KEY,
    task_id     INT            NOT NULL FOREIGN KEY REFERENCES Tasks (id) ON DELETE CASCADE,
    author_name VARCHAR (100)  NOT NULL,
    content     VARCHAR (1000) NOT NULL,
    created_at  DATETIME       DEFAULT GETDATE()
);

GO
-- ==========================================
-- DATOS DE PRUEBA (SEED)
-- ==========================================

INSERT INTO Classrooms (name, duenio, join_code) VALUES
('Laboratorio de Software', 'Prof. Luciano', 'GL-1001'),
('Bases de Datos II', 'Prof. Luciano', 'GL-1002'),
('Programacion Web II', 'Prof. Martin', 'GL-1003'),
('Ingenieria de Software', 'Prof. Laura', 'GL-1004'),
('Arquitectura de Sistemas', 'Prof. Diego', 'GL-1005'),
('Desarrollo Frontend Angular', 'Prof. Carla', 'GL-1006'),
('Backend con Node y Express', 'Prof. Marcos', 'GL-1007'),
('Redes y Seguridad', 'Prof. Valeria', 'GL-1008'),
('Metodologias Agiles', 'Prof. Esteban', 'GL-1009'),
('Proyecto Final Integrador', 'Prof. Luciano', 'GL-1010');

INSERT INTO Groups (classroom_id, group_number, project_name) VALUES
(1, 1, 'GrupLab Kanban'),
(1, 2, 'App Turnos Medicos'),
(2, 1, 'Sistema Biblioteca'),
(2, 2, 'Control de Stock'),
(3, 1, 'Portal de Noticias'),
(3, 2, 'Blog Universitario'),
(4, 1, 'Gestor de Proyectos'),
(4, 2, 'Plataforma Cursos'),
(5, 1, 'Monitor de Servicios'),
(5, 2, 'Balanceador de Carga'),
(6, 1, 'Dashboard Ventas'),
(6, 2, 'Agenda Escolar'),
(7, 1, 'API Facturacion'),
(7, 2, 'Pasarela de Pagos'),
(8, 1, 'Auditoria de Accesos'),
(8, 2, 'Scanner de Puertos'),
(9, 1, 'Tablero Scrum'),
(9, 2, 'Retrospectivas Online'),
(10, 1, 'E-Commerce Local'),
(10, 2, 'Sistema Reservas');

INSERT INTO Members (classroom_id, group_id, nombre, email, rol) VALUES
(1, NULL, 'Prof. Luciano', 'luciano@ifts.edu.ar', 'profesor'),
(2, NULL, 'Prof. Luciano', 'luciano@ifts.edu.ar', 'profesor'),
(3, NULL, 'Prof. Martin', 'martin@ifts.edu.ar', 'profesor'),
(4, NULL, 'Prof. Laura', 'laura@ifts.edu.ar', 'profesor'),
(5, NULL, 'Prof. Diego', 'diego@ifts.edu.ar', 'profesor'),
(6, NULL, 'Prof. Carla', 'carla@ifts.edu.ar', 'profesor'),
(7, NULL, 'Prof. Marcos', 'marcos@ifts.edu.ar', 'profesor'),
(8, NULL, 'Prof. Valeria', 'valeria@ifts.edu.ar', 'profesor'),
(9, NULL, 'Prof. Esteban', 'esteban@ifts.edu.ar', 'profesor'),
(10, NULL, 'Prof. Luciano', 'luciano@ifts.edu.ar', 'profesor'),
(1, 1, 'Gonzalo', 'gonzalo@ifts.edu.ar', 'alumno'),
(1, 1, 'Abel', 'abel@ifts.edu.ar', 'alumno'),
(1, 2, 'Leandro', 'leandro@ifts.edu.ar', 'alumno'),
(1, NULL, 'Leonardo', 'leonardo@ifts.edu.ar', 'alumno'),
(2, 3, 'Juan Perez', 'juan@ifts.edu.ar', 'alumno'),
(2, 3, 'Maria Lopez', 'maria@ifts.edu.ar', 'alumno'),
(2, 4, 'Carlos Gomez', 'carlos@ifts.edu.ar', 'alumno'),
(2, NULL, 'Sofia Diaz', 'sofia@ifts.edu.ar', 'alumno'),
(3, 5, 'Lucas Fernandez', 'lucas@ifts.edu.ar', 'alumno'),
(3, 5, 'Ignacio Morales', 'ignacio@ifts.edu.ar', 'alumno'),
(3, 6, 'Rocio Herrera', 'rocio@ifts.edu.ar', 'alumno'),
(3, NULL, 'Valentina Ruiz', 'valentina@ifts.edu.ar', 'alumno'),
(4, 7, 'Mateo Silva', 'mateo@ifts.edu.ar', 'alumno'),
(4, 7, 'Bruno Pereyra', 'bruno@ifts.edu.ar', 'alumno'),
(4, 8, 'Camila Torres', 'camila@ifts.edu.ar', 'alumno'),
(4, NULL, 'Delfina Acuna', 'delfina@ifts.edu.ar', 'alumno'),
(5, 9, 'Tomas Romero', 'tomas@ifts.edu.ar', 'alumno'),
(5, 9, 'Ezequiel Alvarez', 'ezequiel@ifts.edu.ar', 'alumno'),
(5, 10, 'Micaela Benitez', 'micaela@ifts.edu.ar', 'alumno'),
(5, NULL, 'Gabriel Molina', 'gabriel@ifts.edu.ar', 'alumno'),
(6, 11, 'Agustina Sosa', 'agustina@ifts.edu.ar', 'alumno'),
(6, 11, 'Federico Ramos', 'federico@ifts.edu.ar', 'alumno'),
(6, 12, 'Franco Castro', 'franco@ifts.edu.ar', 'alumno'),
(6, NULL, 'Candela Rojas', 'candela@ifts.edu.ar', 'alumno'),
(7, 13, 'Julieta Vega', 'julieta@ifts.edu.ar', 'alumno'),
(7, 13, 'Matias Cabrera', 'matias@ifts.edu.ar', 'alumno'),
(7, 14, 'Lucia Paredes', 'lucia@ifts.edu.ar', 'alumno'),
(7, NULL, 'Thiago Medina', 'thiago@ifts.edu.ar', 'alumno'),
(8, 15, 'Nicolas Ortiz', 'nicolas@ifts.edu.ar', 'alumno'),
(8, 15, 'Bautista Flores', 'bautista@ifts.edu.ar', 'alumno'),
(8, 16, 'Abril Gimenez', 'abril@ifts.edu.ar', 'alumno'),
(8, NULL, 'Dylan Suarez', 'dylan@ifts.edu.ar', 'alumno'),
(9, 17, 'Martina Rios', 'martina@ifts.edu.ar', 'alumno'),
(9, 17, 'Joaquin Vera', 'joaquin@ifts.edu.ar', 'alumno'),
(9, 18, 'Zoe Dominguez', 'zoe@ifts.edu.ar', 'alumno'),
(9, NULL, 'Lautaro Ponce', 'lautaro@ifts.edu.ar', 'alumno'),
(10, 19, 'Santiago Mendez', 'santiago@ifts.edu.ar', 'alumno'),
(10, 19, 'Victoria Ibarra', 'victoria@ifts.edu.ar', 'alumno'),
(10, 20, 'Paula Navarro', 'paula@ifts.edu.ar', 'alumno'),
(10, NULL, 'Renzo Duarte', 'renzo@ifts.edu.ar', 'alumno');

INSERT INTO BoardColumns (group_id, name, position, color) VALUES
(1, 'Por hacer', 1, 'secondary'),
(1, 'En progreso', 2, 'primary'),
(1, 'En revision', 3, 'warning'),
(1, 'Terminado', 4, 'success'),
(2, 'Por hacer', 1, 'secondary'),
(2, 'En progreso', 2, 'primary'),
(2, 'En revision', 3, 'warning'),
(2, 'Terminado', 4, 'success'),
(3, 'Por hacer', 1, 'secondary'),
(3, 'En progreso', 2, 'primary'),
(3, 'En revision', 3, 'warning'),
(3, 'Terminado', 4, 'success'),
(4, 'Por hacer', 1, 'secondary'),
(4, 'En progreso', 2, 'primary'),
(4, 'En revision', 3, 'warning'),
(4, 'Terminado', 4, 'success'),
(5, 'Por hacer', 1, 'secondary'),
(5, 'En progreso', 2, 'primary'),
(5, 'En revision', 3, 'warning'),
(5, 'Terminado', 4, 'success'),
(6, 'Por hacer', 1, 'secondary'),
(6, 'En progreso', 2, 'primary'),
(6, 'En revision', 3, 'warning'),
(6, 'Terminado', 4, 'success'),
(7, 'Por hacer', 1, 'secondary'),
(7, 'En progreso', 2, 'primary'),
(7, 'En revision', 3, 'warning'),
(7, 'Terminado', 4, 'success'),
(8, 'Por hacer', 1, 'secondary'),
(8, 'En progreso', 2, 'primary'),
(8, 'En revision', 3, 'warning'),
(8, 'Terminado', 4, 'success'),
(9, 'Por hacer', 1, 'secondary'),
(9, 'En progreso', 2, 'primary'),
(9, 'En revision', 3, 'warning'),
(9, 'Terminado', 4, 'success'),
(10, 'Por hacer', 1, 'secondary'),
(10, 'En progreso', 2, 'primary'),
(10, 'En revision', 3, 'warning'),
(10, 'Terminado', 4, 'success');

INSERT INTO Tasks (group_id, column_id, assigned_to, title, description) VALUES
(1, 1, 11, 'Configurar base de datos', 'Crear tablas y datos de prueba en SQL Server'),
(1, 2, 12, 'Disenar tablero Kanban', 'Armar columnas dinamicas y tarjetas de tareas'),
(1, 2, NULL, 'Agregar filtros por miembro', 'Permitir filtrar tareas sin asignar'),
(1, 3, 11, 'Probar endpoints de miembros', 'Validar asignacion y baja en peticionesTest.http'),
(1, 4, 12, 'Definir arquitectura', 'Separar routes, controllers, services y repositories'),
(2, 5, 13, 'Modelo de turnos', 'Definir tabla de horarios y pacientes'),
(2, 6, 13, 'Vista de agenda diaria', 'Listar turnos por medico y estado'),
(2, 7, NULL, 'Validar solapamiento', 'Evitar dos turnos en el mismo horario'),
(3, 9, 15, 'Catalogo de libros', 'Alta, baja y busqueda por ISBN'),
(3, 10, 16, 'Prestamos y devoluciones', 'Registrar fecha limite de devolucion'),
(3, 11, 15, 'Reporte de morosos', 'Listar socios con entregas vencidas'),
(4, 13, 17, 'Alta de productos', 'Cargar codigo, nombre y stock minimo'),
(4, 14, NULL, 'Alerta de bajo stock', 'Marcar productos por debajo del minimo'),
(5, 17, 19, 'Maquetar portada', 'Disenar grilla principal de noticias'),
(5, 18, 20, 'Buscador por categoria', 'Filtrar articulos por seccion'),
(6, 21, 21, 'Editor de articulos', 'Permitir cargar titulo, resumen y cuerpo'),
(6, 22, NULL, 'Moderacion de comentarios', 'Aprobar o rechazar comentarios de lectores'),
(7, 25, 23, 'Diagrama de Gantt', 'Mostrar fechas de inicio y fin por hito'),
(7, 26, 24, 'Asignacion de horas', 'Registrar horas estimadas por integrante'),
(8, 29, 25, 'Reproductor de clases', 'Integrar vista de video y materiales'),
(8, 30, NULL, 'Certificados PDF', 'Generar comprobante al finalizar modulo'),
(9, 33, 27, 'Healthcheck de APIs', 'Consultar estado de microservicios cada 30s'),
(9, 34, 28, 'Panel de latencias', 'Mostrar tiempo promedio de respuesta'),
(10, 37, 29, 'Algoritmo Round Robin', 'Distribuir requests entre nodos activos'),
(10, 38, NULL, 'Failover automatico', 'Desviar trafico si un nodo deja de responder');

INSERT INTO Comments (task_id, author_name, content) VALUES
(1, 'Gonzalo', 'Ya quedaron creadas todas las tablas en schema.sql'),
(2, 'Abel', 'Las 4 columnas base se crean automaticamente si el tablero esta vacio'),
(2, 'Prof. Luciano', 'Muy buen avance en el tablero!'),
(4, 'Gonzalo', 'Todos los endpoints respondieron 200 OK'),
(6, 'Leandro', 'Revisar si agregamos duracion variable por turno'),
(9, 'Juan Perez', 'Falta validar ISBN duplicado en el service'),
(10, 'Maria Lopez', 'Listo el calculo de fecha de vencimiento a 7 dias'),
(12, 'Carlos Gomez', 'Arranco con el endpoint de alta de productos'),
(14, 'Lucas Fernandez', 'La portada ya responde bien en mobile'),
(16, 'Rocio Herrera', 'Falta agregar contador de caracteres en el resumen'),
(18, 'Mateo Silva', 'Definimos los hitos base para la primera entrega'),
(20, 'Camila Torres', 'Probando carga de clases por modulo'),
(22, 'Tomas Romero', 'El healthcheck ya registra codigos HTTP 200 y 500'),
(24, 'Micaela Benitez', 'Quedo implementado el reparto circular entre 3 nodos');