
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
