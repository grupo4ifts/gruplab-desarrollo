const commentRepository = require('../repositories/comment.repository');

exports.crearComentario = async (tareaID, autorName, contenido) => {
    if (!tareaID || !autorName || !autorName.trim() || !contenido || !contenido.trim()) {
        throw new Error('Faltan datos para crear el comentario');
    }

    const texto = contenido.trim();
    if (texto.length > 1000) {
        throw new Error('El comentario no puede superar los 1000 caracteres');
    }

    const [tarea] = await commentRepository.obtenertarea(tareaID);
    if (!tarea) {
        throw new Error('Tarea no encontrada');
    }

    const nuevo = await commentRepository.crearComentario(tareaID, autorName.trim(), texto);
    return { message: 'Comentario publicado exitosamente', id: nuevo.id };
};

exports.obtenerComentario = async (tareaID) => {
    if (!tareaID) {
        throw new Error('Falta el id de la tarea');
    }

    const [tarea] = await commentRepository.obtenertarea(tareaID);
    if (!tarea) {
        throw new Error('Tarea no encontrada');
    }

    return await commentRepository.obtenerComentario(tareaID);
};

exports.editarComentario = async (comentarioID, autorName, contenido) => {
    if (!comentarioID || !autorName || !autorName.trim() || !contenido || !contenido.trim()) {
        throw new Error('Faltan datos para editar el comentario');
    }

    const texto = contenido.trim();
    if (texto.length > 1000) {
        throw new Error('El comentario no puede superar los 1000 caracteres');
    }

    const comentario = await commentRepository.obtenerComentarioPorID(comentarioID);
    if (!comentario) {
        throw new Error('Comentario no encontrado');
    }
    if (comentario.author_name !== autorName.trim()) {
        throw new Error('No tenes permiso para editar este comentario');
    }

    await commentRepository.editarComentario(comentarioID, texto);
    return { message: 'Comentario actualizado correctamente' };
};

exports.eliminarComentario = async (comentarioID, autorName) => {
    if (!comentarioID || !autorName || !autorName.trim()) {
        throw new Error('Faltan datos para eliminar el comentario');
    }

    const comentario = await commentRepository.obtenerComentarioPorID(comentarioID);
    if (!comentario) {
        throw new Error('Comentario no encontrado para eliminar');
    }
    if (comentario.author_name !== autorName.trim()) {
        throw new Error('No tenes permiso para eliminar este comentario');
    }

    await commentRepository.eliminarComentario(comentarioID);
    return { message: 'Comentario eliminado correctamente' };
};
