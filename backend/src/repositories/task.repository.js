const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerTareaPorId = async (id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerTareaPorId);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener la tarea');
    }
};