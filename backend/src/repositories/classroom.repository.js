const { sql, getConnection } = require('../database/connection');
const { queries } = require('../database/queries');

exports.obtenerAulas = async () => {
    const pool = await getConnection();
    const resultado = await pool.request().query(queries.obtenerAulas);
    return resultado.recordset;
};

exports.crearAula = async (nombre, codigo, descripcion) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('name', sql.NVarChar, nombre)
        .input('code', sql.NVarChar, codigo)
        .input('description', sql.NVarChar, descripcion)
        .query(queries.crearAula);
    return resultado.recordset;
};

exports.obtenerAulaPorCodigo = async (codigo) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('code', sql.NVarChar, codigo)
        .query(queries.obtenerAulaPorCodigo);
    return resultado.recordset;
};

exports.eliminarAula = async (codigo) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('code', sql.NVarChar, codigo)
        .query(queries.eliminarAula);
    return resultado.recordset;
};