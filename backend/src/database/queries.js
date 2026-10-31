exports.queries = {
    obtenerAulas: 'SELECT * FROM Classrooms',
    crearAula: 'INSERT INTO Classrooms (name, join_code, duenio) OUTPUT INSERTED.id VALUES (@name, @join_code, @duenio)',
    obtenerAulaPorCodigo: 'SELECT * FROM Classrooms WHERE join_code = @join_code',
    obtenerAulaPorId: 'SELECT * FROM Classrooms WHERE id = @id',
    eliminarAula: 'DELETE FROM Classrooms WHERE id = @id'
};

