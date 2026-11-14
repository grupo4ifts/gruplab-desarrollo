const groupRepository = require('../repositories/group.repository');

exports.obtenerGruposPorAula = async (classroom_id) => {
    if (!classroom_id) {
        throw new Error('Falta el id del aula');
    }
    return await groupRepository.obtenerGruposPorAula(classroom_id);
};

exports.obtenerGrupoPorId = async (id) => {
    const [grupo] = await groupRepository.obtenerGrupoPorId(id);
    if (!grupo) {
        throw new Error('Grupo no encontrado');
    }
    return grupo;
};

exports.crearGrupo = async (classroom_id, project_name, group_number) => {
    if (!classroom_id || !project_name) {
        throw new Error('Faltan datos para crear el grupo');
    }

    let numeroFinal = group_number;
    if (!numeroFinal) {
        const grupos = await groupRepository.obtenerGruposPorAula(classroom_id);
        numeroFinal = grupos.length + 1;
    }

    await groupRepository.crearGrupo(classroom_id, numeroFinal, project_name.trim());
    return { message: 'Grupo creado exitosamente', group_number: numeroFinal };
};

exports.actualizarGrupo = async (id, project_name) => {
    if (!project_name) {
        throw new Error('El nombre del proyecto es obligatorio');
    }

    const [grupo] = await groupRepository.obtenerGrupoPorId(id);
    if (!grupo) {
        throw new Error('Grupo no encontrado');
    }

    await groupRepository.actualizarGrupo(id, project_name.trim());
    return { message: 'Grupo actualizado correctamente' };
};

exports.eliminarGrupo = async (id) => {
    const [grupo] = await groupRepository.obtenerGrupoPorId(id);
    if (!grupo) {
        throw new Error('Grupo no encontrado para eliminar');
    }

    await groupRepository.eliminarGrupo(id);
    return { message: 'Grupo eliminado correctamente' };
};