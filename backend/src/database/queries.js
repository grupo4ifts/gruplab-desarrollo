const queryBaseSelect = `SELECT
    id,
    name,
    duenio,
    join_code
FROM Classrooms`;

const queryBaseSelectMiembros = `SELECT
    m.id,
    m.classroom_id,
    m.group_id,
    g.project_name AS group_name,
    m.nombre,
    m.email,
    m.rol,
    m.created_at
FROM Members m
LEFT JOIN Groups g ON g.id = m.group_id`;

const queryBaseSelectGrupos = `SELECT
    id,
    classroom_id,
    group_number,
    project_name
FROM Groups`;

module.exports = {
    obtenerAulas: queryBaseSelect,

    crearAula: `INSERT INTO Classrooms
        (name, join_code, duenio)
    OUTPUT INSERTED.id
    VALUES
        (@name, @join_code, @duenio)`,

    obtenerAulaPorCodigo: `${queryBaseSelect}
        WHERE join_code = @join_code`,

    obtenerAulaPorId: `${queryBaseSelect}
        WHERE id = @id`,

    eliminarAula: `DELETE FROM Classrooms WHERE id = @id`,


    obtenerMiembrosPorAula: `${queryBaseSelectMiembros}
        WHERE m.classroom_id = @classroom_id
        ORDER BY CASE WHEN m.rol = 'profesor' THEN 0 ELSE 1 END, m.nombre`,

    obtenerMiembrosPorGrupo: `${queryBaseSelectMiembros}
        WHERE m.group_id = @group_id
        ORDER BY m.nombre`,

    obtenerMiembroPorId: `${queryBaseSelectMiembros}
        WHERE m.id = @id`,

    obtenerMiembroPorNombre: `${queryBaseSelectMiembros}
        WHERE m.classroom_id = @classroom_id AND m.nombre = @nombre`,

    agregarMiembro: `INSERT INTO Members
        (classroom_id, nombre, email, rol)
    OUTPUT INSERTED.id
    VALUES
        (@classroom_id, @nombre, @email, @rol)`,

    asignarGrupo: `UPDATE Members SET group_id = @group_id WHERE id = @id`,


    obtenerAulaDelGrupo: `SELECT classroom_id FROM Groups WHERE id = @group_id`,


    liberarTareasDelMiembro: `IF OBJECT_ID('Tasks') IS NOT NULL
        UPDATE Tasks SET assigned_to = NULL WHERE assigned_to = @id`,

    eliminarMiembro: `DELETE FROM Members WHERE id = @id`,

    eliminarMiembrosPorAula: `DELETE FROM Members WHERE classroom_id = @classroom_id`,

    obtenerGruposPorAula: `${queryBaseSelectGrupos}
        WHERE classroom_id = @classroom_id
        ORDER BY group_number`,

    obtenerGrupoPorId: `${queryBaseSelectGrupos}
        WHERE id = @id`,

    crearGrupo: `INSERT INTO Groups
        (classroom_id, group_number, project_name)
        VALUES
        (@classroom_id, @group_number, @project_name)`,

    actualizarGrupo: `UPDATE Groups
        SET project_name = @project_name
        WHERE id = @id`,

    eliminarGrupo: `DELETE FROM Groups WHERE id = @id`,

};