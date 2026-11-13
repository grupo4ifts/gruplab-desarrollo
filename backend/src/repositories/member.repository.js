const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerMiembrosPorAula = async (classroom_id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .query(queries.obtenerMiembrosPorAula);
    return resultado.recordset;
};

exports.obtenerMiembrosPorGrupo = async (group_id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('group_id', sql.Int, group_id)
        .query(queries.obtenerMiembrosPorGrupo);
    return resultado.recordset;
};

exports.obtenerMiembroPorId = async (id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.obtenerMiembroPorId);
    return resultado.recordset;
};

exports.obtenerMiembroPorNombre = async (classroom_id, nombre) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .input('nombre', sql.VarChar, nombre)
        .query(queries.obtenerMiembroPorNombre);
    return resultado.recordset;
};

exports.agregarMiembro = async (classroom_id, nombre, email, rol) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .input('nombre', sql.VarChar, nombre)
        .input('email', sql.VarChar, email)
        .input('rol', sql.VarChar, rol)
        .query(queries.agregarMiembro);
    return resultado.recordset;
};

exports.asignarGrupo = async (id, group_id) => {
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .input('group_id', sql.Int, group_id)
        .query(queries.asignarGrupo);
};

exports.obtenerAulaDelGrupo = async (group_id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('group_id', sql.Int, group_id)
        .query(queries.obtenerAulaDelGrupo);
    return resultado.recordset;
};

exports.liberarTareasDelMiembro = async (id) => {
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .query(queries.liberarTareasDelMiembro);
};

exports.eliminarMiembro = async (id) => {
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .query(queries.eliminarMiembro);
};

exports.eliminarMiembrosPorAula = async (classroom_id) => {
    const pool = await getConnection();
    await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .query(queries.eliminarMiembrosPorAula);
};
