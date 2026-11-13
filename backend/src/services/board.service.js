const boardRepository = require('../repositories/board.repository');
const taskRepository = require('../repositories/task.repository');

exports.obtenerTablero = async (group_id) => {
    if (!group_id) {
        throw new Error('Falta el id del grupo');
    }

    let columns = await boardRepository.obtenerColumnasPorGrupo(group_id);

    if (columns.length === 0) {
        await boardRepository.crearColumna(group_id, 'Por hacer', 1, 'secondary');
        await boardRepository.crearColumna(group_id, 'En progreso', 2, 'primary');
        await boardRepository.crearColumna(group_id, 'En revision', 3, 'warning');
        await boardRepository.crearColumna(group_id, 'Terminado', 4, 'success');

        columns = await boardRepository.obtenerColumnasPorGrupo(group_id);
    }

    const tasks = await boardRepository.obtenerTareasPorGrupo(group_id);
    return { columns, tasks };
};

exports.crearColumna = async (group_id, name, color) => {
    if (!group_id || !name) {
        throw new Error('Faltan datos para crear la columna');
    }

    const columnas = await boardRepository.obtenerColumnasPorGrupo(group_id);
    const position = columnas.length + 1;
    const colorFinal = color || 'secondary';

    const [nueva] = await boardRepository.crearColumna(group_id, name.trim(), position, colorFinal);
    return { message: 'Columna creada exitosamente', id: nueva.id, position };
};

exports.actualizarColumna = async (id, name, color) => {
    if (!name) {
        throw new Error('El nombre de la columna es obligatorio');
    }

    const [columna] = await boardRepository.obtenerColumnaPorId(id);
    if (!columna) {
        throw new Error('Columna no encontrada');
    }

    await boardRepository.actualizarColumna(id, name.trim(), color || columna.color);
    return { message: 'Columna actualizada correctamente' };
};

exports.eliminarColumna = async (id) => {
    const [columna] = await boardRepository.obtenerColumnaPorId(id);
    if (!columna) {
        throw new Error('Columna no encontrada para eliminar');
    }

    await boardRepository.eliminarColumna(id);
    return { message: 'Columna eliminada correctamente' };
};

/*exports.moverTareaDeColumna = async (id, column_id) => {
    const [tarea] = await taskRepository.obtenerTareaPorId(id);
    if (!tarea) {
        throw new Error('Tarea no encontrada');
    }

    const [columna] = await boardRepository.obtenerColumnaPorId(column_id);
    if (!columna) {
        throw new Error('Columna no encontrada');
    }

    await boardRepository.moverTareaDeColumna(id, column_id);
    return { message: 'Tarea movida de columna correctamente' };
};*/