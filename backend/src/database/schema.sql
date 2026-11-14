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
---
CREATE TABLE BoardColumns (
    id         INT          IDENTITY (1, 1) PRIMARY KEY,
    group_id   INT          NOT NULL FOREIGN KEY REFERENCES Groups (id) ON DELETE CASCADE,
    name       VARCHAR (50) NOT NULL, 
    position   INT          NOT NULL, 
    color      VARCHAR (20) DEFAULT 'secondary' NOT NULL 
);
---
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