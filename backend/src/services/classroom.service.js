const classroomRepository = require('../repositories/classroom.repository');

exports.obtenerAulas = async () => {
    const aulas = await classroomRepository.obtenerAulas();
    return aulas;
};

exports.crearAula = async (name, code, description) => {
    if (name === "" || code === "" || description === "") {
        throw new Error('Faltan datos para crear el aula');
    }

    const aulaExistente = await classroomRepository.obtenerAulaPorCodigo(code);

    if (aulaExistente.length > 0) {
        throw new Error('El aula ya existe');
    }

    const resultado = await classroomRepository.crearAula(name, code, description);
    return resultado;
};

exports.obtenerAulaPorCodigo = async (code) => {
    const aula = await classroomRepository.obtenerAulaPorCodigo(code);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada');
    }

    return aula;
};

exports.eliminarAula = async (code) => {
    const aula = await classroomRepository.obtenerAulaPorCodigo(code);

    if (!aula || aula.length === 0) {
        throw new Error('Aula no encontrada para eliminar');
    }

    return await classroomRepository.eliminarAula(code);
};