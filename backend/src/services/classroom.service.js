const classroomRepository = require('../repositories/classroom.repository');

exports.obtenerAulas = async () => {
    const aulas = await classroomRepository.obtenerAulas();
    return aulas;
};

exports.crearAula = async (name, join_code, duenio) => {
    if (!name || !join_code || !duenio) {
        throw new Error('Faltan datos para crear el aula');
    }

    const aulaExistente = await classroomRepository.obtenerAulaPorCodigo(join_code);

    if (aulaExistente && aulaExistente.length > 0) {
        throw new Error('El aula ya existe');
    }

    const resultado = await classroomRepository.crearAula(name, join_code, duenio);
    return resultado;
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

    return await classroomRepository.eliminarAula(id);
};