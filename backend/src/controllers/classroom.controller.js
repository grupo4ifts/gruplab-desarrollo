const classroomService = require('../services/classroom.service');

exports.obtenerAulas = async (req, res) => {
    try {
        const aulas = await classroomService.obtenerAulas();
        res.status(200).json(aulas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.crearAula = async (req, res) => {
    try {
        const { name, duenio } = req.body || {};
        const resultado = await classroomService.crearAula(name, duenio);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerAulaPorCodigo = async (req, res) => {
    try {
        const { join_code } = req.params;
        const aula = await classroomService.obtenerAulaPorCodigo(join_code);
        res.status(200).json(aula);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerAulaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const aula = await classroomService.obtenerAulaPorId(id);
        res.json(aula);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarAula = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await classroomService.eliminarAula(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
