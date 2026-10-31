const { sql, getConnection } = require('../database/connection');
const { queries } = require('../database/queries');

exports.obtenerAulas = async () => {
    const pool = await getConnection();
    const resultado = await pool.request().query(queries.obtenerAulas);
    return resultado.recordset;
};

exports.crearAula = async (nombre, join_code, duenio) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('name', sql.NVarChar, nombre)
        .input('join_code', sql.NVarChar, join_code)
        .input('duenio', sql.NVarChar, duenio)
        .query(queries.crearAula);
    return resultado.recordset;
};

exports.obtenerAulaPorCodigo = async (join_code) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('join_code', sql.NVarChar, join_code)
        .query(queries.obtenerAulaPorCodigo);
    return resultado.recordset;
};

exports.obtenerAulaPorId = async (id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.obtenerAulaPorId);
    return resultado.recordset;
};

exports.eliminarAula = async (id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.eliminarAula);
    return resultado.recordset;
};