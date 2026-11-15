const groupRepository = require('../repositories/group.repository');
const classroomRepository = require('../repositories/classroom.repository');

const validarAula = async (classroom_id) => {
    if (!classroom_id) {
        throw new Error('Falta el id del aula');
    }

    const [aula] = await classroomRepository.obtenerAulaPorId(classroom_id);
    if (!aula) {
        throw new Error('Aula no encontrada');
    }
};

exports.obtenerGruposPorAula = async (classroom_id) => {
    await validarAula(classroom_id);
    return await groupRepository.obtenerGruposPorAula(classroom_id);
};

exports.obtenerGrupoPorId = async (id) => {
    const [grupo] = await groupRepository.obtenerGrupoPorId(id);
    if (!grupo) {
        throw new Error('Grupo no encontrado');
    }
    return grupo;
};

exports.crearGrupo = async (classroom_id, project_name) => {
    if (!project_name) {
        throw new Error('Faltan datos para crear el grupo');
    }
    await validarAula(classroom_id);

    const grupos = await groupRepository.obtenerGruposPorAula(classroom_id);

    let group_number = 1;
    if (grupos.length > 0) {
        group_number = grupos[grupos.length - 1].group_number + 1;
    }

    await groupRepository.crearGrupo(classroom_id, group_number, project_name.trim());
    return { message: 'Grupo creado exitosamente', group_number };
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