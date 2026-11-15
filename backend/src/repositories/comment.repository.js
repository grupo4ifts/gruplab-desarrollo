const { sql, getConnection } = require('../database/connection')
const queries = require('../database/queries')
exports.crearComentario = async (tareaID, autorName, contenido) => {
    try {
        const pool = await getConnection()
        const resultado = await pool.request()
            .input('task_id', sql.Int, tareaID)
            .input('author_name', sql.VarChar(100), autorName)
            .input('content', sql.VarChar(1000), contenido)
            .query(queries.crearComentario)

        return resultado.recordset[0]
    } catch (error) {
        throw error
    }
}

exports.obtenertarea = async (idTarea) => {
    try {
        const pool = await getConnection()

        const resultado = await pool.request()
            .input('id', sql.Int, idTarea)
            .query(queries.obtenerTareaPorId)

        return resultado.recordset
    } catch (error) {
        throw error
    }
}

exports.obtenerComentario = async (tareaID) => {
    try {
        const pool = await getConnection()

        const resultado = await pool.request()
            .input('task_id', sql.Int, tareaID)
            .query(queries.obtenerComentariosPorTarea)

        return resultado.recordset
    } catch (error) {
        throw error
    }
}

exports.obtenerComentarioPorID = async (comentarioID) => {
    try {
        const pool = await getConnection()

        const resultado = await pool.request()
            .input('id', sql.Int, comentarioID)
            .query(queries.obtenerComentarioPorId)
        return resultado.recordset[0]
    } catch (error) {
        throw error
    }
}

exports.editarComentario = async (comentarioID, contenido) => {
    try {
        const pool = await getConnection()

        const resultado = await pool.request()
            .input('id', sql.Int, comentarioID)
            .input('content', sql.VarChar(1000), contenido)
            .query(queries.editarComentario)
        return resultado.rowsAffected[0]
    } catch (error) {
        throw error
    }
}

exports.eliminarComentario = async (comentarioID) => {
    try {
        const pool = await getConnection()

        const resultado = await pool.request()
            .input('id', sql.Int, comentarioID)
            .query(queries.eliminarComentario)

        return resultado.rowsAffected[0]

    } catch (error) {
        throw error
    }
}