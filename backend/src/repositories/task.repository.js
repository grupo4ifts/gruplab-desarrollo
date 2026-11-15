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

exports.crearTarea = async (group_id, column_id, assigned_to, title, description) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('group_id', sql.Int, group_id)
            .input('column_id', sql.Int, column_id)
            .input('assigned_to', sql.Int, assigned_to)
            .input('title', sql.VarChar(150), title)
            .input('description', sql.VarChar(1000), description)
            .query(queries.crearTarea);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear la tarea');
    }
};

exports.actualizarTarea = async (id, title, description, assigned_to) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar(150), title)
            .input('description', sql.VarChar(1000), description)
            .input('assigned_to', sql.Int, assigned_to)
            .query(queries.actualizarTarea);
    } catch (error) {
        throw new Error('Error al actualizar la tarea');
    }
};

exports.eliminarTarea = async (id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarTarea);
    } catch (error) {
        throw new Error('Error al eliminar la tarea');
    }
};

exports.crearTarea = async (group_id, column_id, assigned_to, title, description) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('group_id', sql.Int, group_id)
            .input('column_id', sql.Int, column_id)
            .input('assigned_to', sql.Int, assigned_to)
            .input('title', sql.VarChar(150), title)
            .input('description', sql.VarChar(1000), description)
            .query(queries.crearTarea);
        return resultado.recordset[0];
    } catch (error) {
        throw new Error('Error al crear la tarea');
    }
};

exports.actualizarTarea = async (id, title, description, assigned_to) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar(150), title)
            .input('description', sql.VarChar(1000), description)
            .input('assigned_to', sql.Int, assigned_to)
            .query(queries.actualizarTarea);
    } catch (error) {
        throw new Error('Error al actualizar la tarea');
    }
};

exports.eliminarTarea = async (id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarTarea);
    } catch (error) {
        throw new Error('Error al eliminar la tarea');
    }
};
