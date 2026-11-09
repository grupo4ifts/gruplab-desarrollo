const memberRepository = require('../repositories/member.repository');
const classroomRepository = require('../repositories/classroom.repository');

exports.obtenerMiembrosPorAula = async (classroomId) => {
    if (!classroomId) {
        throw new Error('Falta el id del aula');
    }

    return await memberRepository.obtenerMiembrosPorAula(classroomId);
};

exports.obtenerMiembrosPorGrupo = async (groupId) => {
    if (!groupId) {
        throw new Error('Falta el id del grupo');
    }

    return await memberRepository.obtenerMiembrosPorGrupo(groupId);
};

exports.agregarMiembro = async (classroomId, nombre, email, rol) => {
    if (!classroomId || !nombre) {
        throw new Error('Faltan datos para registrar el miembro');
    }

    const [existente] = await memberRepository.obtenerMiembroPorNombre(classroomId, nombre.trim());

    if (existente) {
        return { message: 'El miembro ya estaba registrado en el aula', id: existente.id };
    }

    const rolFinal = rol === 'profesor' ? 'profesor' : 'alumno';
    const [nuevo] = await memberRepository.agregarMiembro(classroomId, nombre.trim(), email || null, rolFinal);

    return { message: 'Miembro agregado exitosamente', id: nuevo.id };
};

exports.asignarGrupo = async (id, groupId) => {
    const [miembro] = await memberRepository.obtenerMiembroPorId(id);

    if (!miembro) {
        throw new Error('Miembro no encontrado');
    }
    if (!groupId) {
        await memberRepository.asignarGrupo(id, null);
        return { message: 'Miembro quitado del grupo correctamente' };
    }

    await memberRepository.asignarGrupo(id, groupId);
    return { message: 'Grupo asignado correctamente' };
};

exports.eliminarMiembro = async (id) => {
    const [miembro] = await memberRepository.obtenerMiembroPorId(id);

    if (!miembro) {
        throw new Error('Miembro no encontrado para eliminar');
    }

    await memberRepository.eliminarMiembro(id);
    return { message: 'Miembro eliminado correctamente' };
};