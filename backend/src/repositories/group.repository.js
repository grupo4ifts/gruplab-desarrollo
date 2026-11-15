const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerGruposPorAula = async (classroom_id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .query(queries.obtenerGruposPorAula);
        return resultado.recordset;
    }
    catch {
        throw new Error('Error al obtener los grupos');
    }

};

exports.obtenerGrupoPorId = async (id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerGrupoPorId);
        return resultado.recordset;
    }
    catch {
        throw new Error('Error al obtener el grupo')
    }

};

exports.crearGrupo = async (classroom_id, group_number, project_name) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .input('group_number', sql.Int, group_number)
            .input('project_name', sql.VarChar, project_name)
            .query(queries.crearGrupo);
    }
    catch {
        throw new Error('Error al crear el grupo')
    }

};

exports.actualizarGrupo = async (id, project_name) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .input('project_name', sql.NVarChar, project_name)
            .query(queries.actualizarGrupo);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al actualizar el grupo');
    }
};

exports.eliminarGrupo = async (id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarGrupo);
        return resultado.rowsAffected[0];
    } catch (error) {
        throw new Error('Error al eliminar el grupo');
    }
};
