const queryBaseSelect = `SELECT
    id,
    name,
    duenio,
    join_code
FROM Classrooms`;

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