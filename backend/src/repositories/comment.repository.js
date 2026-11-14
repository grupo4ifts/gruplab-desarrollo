
const { sql, getConnection } = require('../database/connection')
const queries = require('../database/queries')

exports.crearComentario = async (tareaID, autorName, contenido) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('task_id', sql.Int, tareaID)
        .input('author_name', sql.VarChar(100), autorName)
        .input('content', sql.VarChar(1000), contenido)
        .query(queries.crearComentario)

    return resultado.recordset[0]
}

exports.obtenertarea = async (idTarea) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('id', sql.Int, idTarea)
        .query(queries.obtenerTareaPorId)

    return resultado.recordset
}

exports.obtenerComentario = async (tareaID) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('task_id', sql.Int, tareaID)
        .query(queries.obtenerComentariosPorTarea)

    return resultado.recordset
}

exports.obtenerComentarioPorID = async (comentarioID) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('id', sql.Int, comentarioID)
        .query(queries.obtenerComentarioPorId)

    return resultado.recordset[0]
}

exports.editarComentario = async (comentarioID, contenido) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('id', sql.Int, comentarioID)
        .input('content', sql.VarChar(1000), contenido)
        .query(queries.editarComentario)

    return resultado.rowsAffected[0] 
}

exports.eliminarComentario = async (comentarioID) => {
    const pool = await getConnection()

    const resultado = await pool.request()
        .input('id', sql.Int, comentarioID)
        .query(queries.eliminarComentario)

    return resultado.rowsAffected[0]
}
