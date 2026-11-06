const queryBaseSelect = `SELECT
    id,
    name,
    duenio,
    join_code
FROM Classrooms`;

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

};