const taskRepository = require('../repositories/task.repository');
const boardRepository = require('../repositories/board.repository');
const memberRepository = require('../repositories/member.repository');

exports.obtenerTareaPorId = async (id) => {
    if (!id) {
        throw new Error('Falta el id de la tarea');
    }

    const [tarea] = await taskRepository.obtenerTareaPorId(id);
    if (!tarea) {
        throw new Error('Tarea no encontrada');
    }

    return tarea;
};

exports.crearTarea = async (group_id, column_id, assigned_to, title, description) => {
    if (!group_id || !column_id || !title || !title.trim()) {
        throw new Error('Faltan datos para crear la tarea');
    }

    const titulo = title.trim();
    if (titulo.length > 150) {
        throw new Error('El titulo no puede superar los 150 caracteres');
    }

    const descripcion = description ? description.trim() : null;
    if (descripcion && descripcion.length > 1000) {
        throw new Error('La descripcion no puede superar los 1000 caracteres');
    }

    const [columna] = await boardRepository.obtenerColumnaPorId(column_id);
    if (!columna || columna.group_id !== Number(group_id)) {
        throw new Error('La columna no pertenece al grupo');
    }

    const asignadoId = assigned_to ? Number(assigned_to) : null;
    if (asignadoId) {
        const [miembro] = await memberRepository.obtenerMiembroPorId(asignadoId);
        if (!miembro) {
            throw new Error('El miembro asignado no existe');
        }
    }

    const nueva = await taskRepository.crearTarea(group_id, column_id, asignadoId, titulo, descripcion);
    return { message: 'Tarea creada exitosamente', id: nueva.id };
};

exports.actualizarTarea = async (id, title, description, assigned_to) => {
    if (!id || !title || !title.trim()) {
        throw new Error('Faltan datos para actualizar la tarea');
    }

    const titulo = title.trim();
    if (titulo.length > 150) {
        throw new Error('El titulo no puede superar los 150 caracteres');
    }

    const descripcion = description ? description.trim() : null;
    if (descripcion && descripcion.length > 1000) {
        throw new Error('La descripcion no puede superar los 1000 caracteres');
    }

    const [tarea] = await taskRepository.obtenerTareaPorId(id);
    if (!tarea) {
        throw new Error('Tarea no encontrada');
    }

    const asignadoId = assigned_to ? Number(assigned_to) : null;
    if (asignadoId) {
        const [miembro] = await memberRepository.obtenerMiembroPorId(asignadoId);
        if (!miembro) {
            throw new Error('El miembro asignado no existe');
        }
    }

    await taskRepository.actualizarTarea(id, titulo, descripcion, asignadoId);
    return { message: 'Tarea actualizada correctamente' };
};

exports.eliminarTarea = async (id) => {
    const [tarea] = await taskRepository.obtenerTareaPorId(id);
    if (!tarea) {
        throw new Error('Tarea no encontrada para eliminar');
    }

    await taskRepository.eliminarTarea(id);
    return { message: 'Tarea eliminada correctamente' };
};
