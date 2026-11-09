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