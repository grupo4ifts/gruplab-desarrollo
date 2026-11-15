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
(4, 1, 'Gestor de Proyectos'),
(4, 2, 'Plataforma Cursos'),
(5, 1, 'Monitor de Servicios'),
(6, 1, 'Dashboard Ventas'),
(6, 2, 'Agenda Escolar'),
(7, 1, 'API Facturacion'),
(8, 1, 'Auditoria de Accesos'),
(9, 1, 'Tablero Scrum'),
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
(3, NULL, 'Valentina Ruiz', 'valentina@ifts.edu.ar', 'alumno'),
(4, 6, 'Mateo Silva', 'mateo@ifts.edu.ar', 'alumno'),
(4, 7, 'Camila Torres', 'camila@ifts.edu.ar', 'alumno'),
(5, 8, 'Tomas Romero', 'tomas@ifts.edu.ar', 'alumno'),
(6, 9, 'Agustina Sosa', 'agustina@ifts.edu.ar', 'alumno'),
(6, 10, 'Franco Castro', 'franco@ifts.edu.ar', 'alumno'),
(7, 11, 'Julieta Vega', 'julieta@ifts.edu.ar', 'alumno'),
(8, 12, 'Nicolas Ortiz', 'nicolas@ifts.edu.ar', 'alumno'),
(9, 13, 'Martina Rios', 'martina@ifts.edu.ar', 'alumno'),
(10, 14, 'Santiago Mendez', 'santiago@ifts.edu.ar', 'alumno'),
(10, 15, 'Paula Navarro', 'paula@ifts.edu.ar', 'alumno');

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
(4, 'Terminado', 4, 'success');

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
(4, 14, NULL, 'Alerta de bajo stock', 'Marcar productos por debajo del minimo');

INSERT INTO Comments (task_id, author_name, content) VALUES
(1, 'Gonzalo', 'Ya quedaron creadas todas las tablas en schema.sql'),
(2, 'Abel', 'Las 4 columnas base se crean automaticamente si el tablero esta vacio'),
(2, 'Prof. Luciano', 'Muy buen avance en el tablero!'),
(4, 'Gonzalo', 'Todos los endpoints respondieron 200 OK'),
(6, 'Leandro', 'Revisar si agregamos duracion variable por turno'),
(9, 'Juan Perez', 'Falta validar ISBN duplicado en el service'),
(10, 'Maria Lopez', 'Listo el calculo de fecha de vencimiento a 7 dias'),
(12, 'Carlos Gomez', 'Arranco con el endpoint de alta de productos');