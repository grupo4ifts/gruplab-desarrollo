exports.queries = {
    obtenerAulas: 'SELECT * FROM Classrooms',
    crearAula: 'INSERT INTO Classrooms (name, code, description) VALUES (@name, @code, @description)',
    obtenerAulaPorCodigo: 'SELECT * FROM Classrooms WHERE code = @code',
    eliminarAula: 'DELETE FROM Classrooms WHERE code = @code',
};

