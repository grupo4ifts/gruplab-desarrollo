const commentRepository = require('../repositories/comment.repository')
//verifico que tengo la tarea
exports.vetificoTarea = async (idTarea) => {
    const tareaID = await commentRepository.obtenertarea(idTarea)

    if (tareaID.length === 0) {
        throw new Error('Error: La tarea no existe.')
    }
    else {
        return tareaID
    }
}

exports.crearComentario = async (tareaID, autorName, contenido) => {

    await exports.vetificoTarea(tareaID) //accedo a la funcion exportada

    if (!autorName || !contenido.trim()) {//verifico que no sean nula o indefinida y los campos no esten vacíos o no tengan espacios
        throw new Error('Error: Falta el nombre del autor del comentario.')
    }
    if (!contenido || !contenido.trim()) {//verifico que no sean nula o indefinida y los campos no esten vacíos o no tengan espacios
        throw new Error('Error: El comentario esta vacio. Verifique e intente nuevamente.')
    }
    if (contenido.length > 1000) {
        throw new Error('Error: El comentario introducido esta fuera de rango establecido.')
    }

    const GuardarComment = await commentRepository.crearComentario(
        tareaID,
        autorName,
        contenido
    )

    return {
        mensaje: 'Comentario publicado con éxito',
        comentarioID: GuardarComment.id
    }
}

exports.obtenerComentario = async () => { }
exports.editarComentario = async () => { }
exports.eliminarComentario = async () => { }