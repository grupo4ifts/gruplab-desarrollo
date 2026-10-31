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

    const aulaExistente = await classroomRepository.obtenerAulaPorCodigo(join_code);
    if (aulaExistente && aulaExistente.length > 0) {
        throw new Error('Error al generar el codigo, intente nuevamente');
    }

    await classroomRepository.crearAula(name, join_code, duenio);
    return { message: 'Aula creada exitosamente', join_code };
};

exports.obtenerAulaPorCodigo = async (join_code) => {
    const aula = await classroomRepository.obtenerAulaPorCodigo(join_code);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

    return aula;
};

exports.obtenerAulaPorId = async (id) => {
    const aula = await classroomRepository.obtenerAulaPorId(id);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

    return aula;
};

exports.eliminarAula = async (id) => {
    const aula = await classroomRepository.obtenerAulaPorId(id);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada para eliminar');
    }

    await classroomRepository.eliminarAula(id);
    return { message: 'Aula eliminada correctamente' };
};