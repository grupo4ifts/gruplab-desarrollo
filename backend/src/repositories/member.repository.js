const { sql, getConnection } = require('../database/connection');
const queries = require('../database/queries');

exports.obtenerMiembrosPorAula = async (classroom_id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .query(queries.obtenerMiembrosPorAula);
        return resultado.recordset;
    } catch (error) {
        throw new Error('No se pudieron obtener los miembros del aula');
    }
};

exports.obtenerMiembrosPorGrupo = async (group_id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('group_id', sql.Int, group_id)
            .query(queries.obtenerMiembrosPorGrupo);
        return resultado.recordset;
    } catch (error) {
        throw new Error('No se pudieron obtener los miembros del grupo');
    }
};

exports.obtenerMiembroPorId = async (id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, id)
            .query(queries.obtenerMiembroPorId);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener el miembro');
    }
};

exports.obtenerMiembroPorNombre = async (classroom_id, nombre) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .input('nombre', sql.VarChar, nombre)
            .query(queries.obtenerMiembroPorNombre);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al buscar el miembro por nombre');
    }
};

exports.agregarMiembro = async (classroom_id, nombre, email, rol) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .input('rol', sql.VarChar, rol)
            .query(queries.agregarMiembro);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al agregar el miembro');
    }
};

exports.asignarGrupo = async (id, group_id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('group_id', sql.Int, group_id)
            .query(queries.asignarGrupo);
    } catch (error) {
        throw new Error('Error al asignar el grupo al miembro');
    }
};

exports.obtenerAulaDelGrupo = async (group_id) => {
    try {
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('group_id', sql.Int, group_id)
            .query(queries.obtenerAulaDelGrupo);
        return resultado.recordset;
    } catch (error) {
        throw new Error('Error al obtener el grupo');
    }
};

exports.liberarTareasDelMiembro = async (id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query(queries.liberarTareasDelMiembro);
    } catch (error) {
        throw new Error('Error al liberar las tareas del miembro');
    }
};

exports.eliminarMiembro = async (id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .query(queries.eliminarMiembro);
    } catch (error) {
        throw new Error('Error al eliminar el miembro');
    }
};

exports.eliminarMiembrosPorAula = async (classroom_id) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('classroom_id', sql.Int, classroom_id)
            .query(queries.eliminarMiembrosPorAula);
    } catch (error) {
        throw new Error('Error al eliminar los miembros del aula');
    }
};
