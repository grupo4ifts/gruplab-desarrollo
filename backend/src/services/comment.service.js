const commentRepository = require('../repositories/comment.repository')

//verifico que tengo la tarea
exports.verificarTarea = async (idTarea) => {
    const tareaID = await commentRepository.obtenertarea(idTarea)

    if (tareaID.length === 0) {
        throw new Error('Error: La tarea no existe.')
    }
    
    return tareaID
}

exports.crearComentario = async (tareaID, autorName, contenido) => {

    await exports.verificarTarea(tareaID) //accedo a la funcion exportada

    if (!autorName || !autorName.trim()) {//verifico que no sean nula o indefinida y los campos no esten vacíos o no tengan espacios
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

exports.obtenerComentario = async (tareaID) => { 
    await exports.verificarTarea(tareaID)

    const comentarios = await commentRepository.obtenerComentario(tareaID)

    return comentarios
}

exports.editarComentario = async (comentarioID, autorName, contenido) => {

    if (!autorName || !autorName.trim()) {
        throw new Error('Error: Falta el nombre del autor del comentario.')
    }

    if (!contenido || !contenido.trim()) {
        throw new Error('Error: El comentario esta vacio. Verifique e intente nuevamente.')
    }

    if (contenido.length > 1000) {
        throw new Error('Error: El comentario introducido esta fuera de rango establecido.')
    }

    const comentario = await commentRepository.obtenerComentarioPorID(comentarioID)

    if (!comentario) {
        throw new Error('No hay comentarios Realizados.')
    }

    if (comentario.author_name !== autorName) {
        throw new Error('Acceso denegado: No tenes permiso para editar este comentario.')
    }

    return await commentRepository.editarComentario(
        comentarioID,
        contenido
    )
}

exports.eliminarComentario = async (comentarioID, autorName) => {

    if (!autorName || !autorName.trim()) { //verifico que no sean nula o indefinida y los campos no esten vacíos o no tengan espacios
        throw new Error('Error: Falta el nombre del autor del comentario.')
    }

    const comentario = await commentRepository.obtenerComentarioPorID(comentarioID)

    if (!comentario) {
        throw new Error('No hay comentarios Realizados.')
    }

    if (comentario.author_name !== autorName) {
        throw new Error('Acceso denegado: No tenes permiso para eliminar el comentario.')
    }

    return await commentRepository.eliminarComentario(comentarioID)
}
