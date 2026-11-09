const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');


exports.obtenerMiembrosPorAula = async (classroomId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroomId)
            .query(queries.obtenerMiembrosPorAula);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.obtenerMiembrosPorGrupo = async (groupId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('group_id', sql.Int, groupId)
            .query(queries.obtenerMiembrosPorGrupo);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};


exports.obtenerMiembroPorId = async (id) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerMiembroPorId);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.obtenerMiembroPorNombre = async (classroomId, nombre) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroomId)
            .input('nombre', sql.NVarChar, nombre)
            .query(queries.obtenerMiembroPorNombre);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.agregarMiembro = async (classroomId, nombre, email, rol) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroomId)
            .input('nombre', sql.NVarChar, nombre)
            .input('email', sql.NVarChar, email)
            .input('rol', sql.NVarChar, rol)
            .query(queries.agregarMiembro);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};

exports.asignarGrupo = async (id, groupId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('group_id', sql.Int, groupId)
            .query(queries.asignarGrupo);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw error;
    }
};


exports.obtenerAulaDelGrupo = async (groupId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('group_id', sql.Int, groupId)
            .query(queries.obtenerAulaDelGrupo);
        return resultado.recordset;
    } catch (error) {
        throw error;
    }
};


exports.liberarTareasDelMiembro = async (id) => {
    const pool = await getConnection();
    try {
        await pool.request()
            .input('id', sql.Int, id)
            .query(queries.liberarTareasDelMiembro);
    } catch (error) {
        throw error;
    }
};

exports.eliminarMiembro = async (id) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarMiembro);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw error;
    }
};


exports.eliminarMiembrosPorAula = async (classroomId) => {
    const pool = await getConnection();
    try {
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroomId)
            .query(queries.eliminarMiembrosPorAula);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw error;
    }
};