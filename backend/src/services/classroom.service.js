const classroomRepository = require('../repositories/classroom.repository');

exports.obtenerAulas = async () => {
    const aulas = await classroomRepository.obtenerAulas();
    return aulas;
};

exports.crearAula = async (name, duenio) => {
    if (!name || !duenio) {
        throw new Error('Faltan datos para crear el aula');
    }

    const nRandom = Math.floor(1000 + Math.random() * 9000);
    const join_code = `GL-${nRandom}`;

    const newAula = await classroomRepository.crearAula(name, join_code, duenio);
    const classroomId = newAula[0].id;

    return { message: 'Aula creada exitosamente', classroomId, join_code };
};

exports.obtenerAulaPorCodigo = async (join_code) => {
    const aula = await classroomRepository.obtenerAulaPorCodigo(join_code);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

    return aula[0];
};

exports.obtenerAulaPorId = async (id) => {
    const aula = await classroomRepository.obtenerAulaPorId(id);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

    return aula[0];
};

exports.eliminarAula = async (id) => {
    const aulaEliminada = await classroomRepository.eliminarAula(id);

    if (!aulaEliminada || aulaEliminada.length === 0) {
        throw new Error('Aula no encontrada para eliminar');
    }

    return { message: 'Aula eliminada correctamente' };
};