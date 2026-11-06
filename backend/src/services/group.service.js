const groupRepository = require('../repositories/group.repository');
const classroomRepository = require('../repositories/classroom.repository');

const validarId = (id) => {
    if (!Number(id)) {
        throw new Error('Id invalido');
    }
};

const validarNombre = (project_name) => {
    if (!project_name || project_name.trim() === '') {
        throw new Error('El nombre del proyecto es obligatorio');
    }

    if (project_name.length > 100) {
        throw new Error('El nombre del proyecto no puede superar los 100 caracteres');
    }
};

const buscarGrupo = async (id) => {
    validarId(id);

    const grupo = await groupRepository.obtenerGrupoPorId(id);
    if (!grupo || grupo.length === 0) {
        throw new Error('Grupo no encontrado');
    }

    return grupo[0];
};

const validarAula = async (classroom_id) => {
    validarId(classroom_id);

    const aula = await classroomRepository.obtenerAulaPorId(classroom_id);
    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }
};

exports.obtenerGruposPorAula = async (classroom_id) => {
    await validarAula(classroom_id);

    const grupos = await groupRepository.obtenerGruposPorAula(classroom_id);
    return grupos;
};

exports.obtenerGrupoPorId = async (id) => {
    const grupo = await buscarGrupo(id);
    return grupo;
};

exports.crearGrupo = async (classroom_id, project_name) => {
    validarNombre(project_name);
    await validarAula(classroom_id);

    const grupos = await groupRepository.obtenerGruposPorAula(classroom_id);

    const repetido = grupos.find(
        (grupo) => grupo.project_name.toLowerCase() === project_name.toLowerCase()
    );
    if (repetido) {
        throw new Error('Ya existe un grupo con ese nombre en el aula');
    }

    let group_number = 1;
    if (grupos.length > 0) {
        group_number = grupos[grupos.length - 1].group_number + 1;
    }

    await groupRepository.crearGrupo(classroom_id, group_number, project_name);
    return { message: 'Grupo creado exitosamente', group_number };
};

exports.actualizarGrupo = async (id, project_name) => {
    validarNombre(project_name);
    const grupo = await buscarGrupo(id);

    const grupos = await groupRepository.obtenerGruposPorAula(grupo.classroom_id);

    const repetido = grupos.find(
        (otro) => otro.id !== grupo.id && otro.project_name.toLowerCase() === project_name.toLowerCase()
    );
    if (repetido) {
        throw new Error('Ya existe un grupo con ese nombre en el aula');
    }

    await groupRepository.actualizarGrupo(id, project_name);
    return { message: 'Grupo actualizado correctamente' };
};

exports.eliminarGrupo = async (id) => {
    await buscarGrupo(id);

    await groupRepository.eliminarGrupo(id);
    return { message: 'Grupo eliminado correctamente' };
};
