const memberRepository = require('../repositories/member.repository');
const classroomRepository = require('../repositories/classroom.repository');
const taskRepository = require('../repositories/task.repository');

const ROLES_VALIDOS = ['profesor', 'alumno'];

const esIdValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

exports.obtenerMiembrosPorAula = async (classroomId) => {
    if (!esIdValido(classroomId)) {
        throw new Error('Id de aula invalido');  
    }    
    return await memberRepository.obtenerMiembrosPorAula(classroomId);
};

exports.obtenerMiembrosPorGrupo = async (groupId) => {
    if (!esIdValido(groupId)) {
        throw new Error('Id de grupo invalido');
    }
    return await memberRepository.obtenerMiembrosPorGrupo(groupId);
};

exports.agregarMiembro = async (classroomId, nombre, email, rol) => {
    if (!esIdValido(classroomId)) {
        throw new Error('Id de aula invalido');
    }
    
    const nombreLimpio = (nombre || '').trim();
    if (!nombreLimpio) {
        throw new Error('El nombre es obligatorio');   
    }
    if (nombreLimpio.length > 100) {                    
        throw new Error('El nombre no puede superar los 100 caracteres');
    }

    const rolFinal = rol || 'alumno';
    if (!ROLES_VALIDOS.includes(rolFinal)) {
        throw new Error("El rol solo puede ser 'profesor' o 'alumno'");
    }

    const emailLimpio = (email || '').trim() || null;
    if (emailLimpio && emailLimpio.length > 100) {
        throw new Error('El email no puede superar los 100 caracteres');
    }
    
    const aula = await classroomRepository.obtenerAulaPorId(classroomId);
    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

   const existente = await memberRepository.obtenerMiembroPorNombre(classroomId, nombreLimpio);
    if (existente.length > 0) {
        return { message: 'El miembro ya estaba registrado en el aula', id: existente[0].id };
    }

    const nuevo = await memberRepository.agregarMiembro(classroomId, nombreLimpio, emailLimpio, rolFinal);
    return { message: 'Miembro agregado exitosamente', id: nuevo[0].id };
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

    
    const [grupo] = await memberRepository.obtenerAulaDelGrupo(groupId);

    if (!grupo) {
        throw new Error('Grupo no encontrado');
    }
    if (grupo.classroom_id !== miembro.classroom_id) {
        throw new Error('El grupo no pertenece al aula del miembro');
    }

    await memberRepository.asignarGrupo(id, groupId);
    return { message: 'Grupo asignado correctamente' };
};


exports.eliminarMiembro = async (id) => {
    const [miembro] = await memberRepository.obtenerMiembroPorId(id);

    if (!miembro) {
        throw new Error('Miembro no encontrado para eliminar');
    }

    // Antes de borrar, se liberan sus tareas para no romper la Foreign Key de Tasks.assigned_to
    await memberRepository.liberarTareasDelMiembro(id);
    await memberRepository.eliminarMiembro(id);
    return { message: 'Miembro eliminado correctamente' };
};
