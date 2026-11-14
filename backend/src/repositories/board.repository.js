const { sql, getConnection } = require('../database/connection')
const queries = require('../database/queries')


exports.obtenerColumnasPorGrupo = async (groupId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('group_id', sql.Int, groupId)
            .query(queries.obtenerColumnasPorGrupo);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener las columnas del tablero');
    }
};

exports.obtenerColumnaPorId = async (id) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerColumnaPorId);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener la columna');
    }
};

exports.crearColumna = async (groupId, name, position, color) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('group_id', sql.Int, groupId)
            .input('name', sql.NVarChar(50), name)
            .input('position', sql.Int, position)
            .input('color', sql.NVarChar(20), color)
            .query(queries.crearColumna);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al crear la columna');
    }
};

exports.actualizarColumna = async (id, name, color) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar(50), name)
            .input('color', sql.NVarChar(20), color)
            .query(queries.actualizarColumna);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al actualizar la columna');
    }
};

exports.eliminarColumna = async (id) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarColumna);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al eliminar la columna');
    }
};


exports.obtenerTareasPorGrupo = async (groupId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('group_id', sql.Int, groupId)
            .query(queries.obtenerTareasPorGrupo);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener las tareas del tablero');
    }
};

exports.moverTareaDeColumna = async (id, columnId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('column_id', sql.Int, columnId)
            .query(queries.moverTareaDeColumna);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al mover la tarea de columna');
    }
};