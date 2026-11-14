const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerGruposPorAula = async (classroom_id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .query(queries.obtenerGruposPorAula);
    return resultado.recordset;
};

exports.obtenerGrupoPorId = async (id) => {
    const pool = await getConnection();
    const resultado = await pool.request()
        .input('id', sql.Int, id)
        .query(queries.obtenerGrupoPorId);
    return resultado.recordset;
};

exports.crearGrupo = async (classroom_id, group_number, project_name) => {
    const pool = await getConnection();
    await pool.request()
        .input('classroom_id', sql.Int, classroom_id)
        .input('group_number', sql.Int, group_number)
        .input('project_name', sql.VarChar, project_name)
        .query(queries.crearGrupo);
};

exports.actualizarGrupo = async (id, project_name) => {
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .input('project_name', sql.VarChar, project_name)
        .query(queries.actualizarGrupo);
};

exports.eliminarGrupo = async (id) => {
    const pool = await getConnection();
    await pool.request()
        .input('id', sql.Int, id)
        .query(queries.eliminarGrupo);
};
