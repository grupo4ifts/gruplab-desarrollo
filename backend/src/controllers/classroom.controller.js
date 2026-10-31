const classroomService = require('../services/classroom.service');

exports.obtenerAulas = async (req, res) => {
    try {
        const aulas = await classroomService.obtenerAulas();
        res.json(aulas);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

exports.crearAula = async (req, res) => {
    try {
        const { name, join_code, duenio } = req.body;
        await classroomService.crearAula(name, join_code, duenio);
        res.status(201).json({ message: 'Aula creada exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerAulaPorCodigo = async (req, res) => {
    try {
        const { join_code } = req.params;
        const aula = await classroomService.obtenerAulaPorCodigo(join_code);
        res.json(aula);
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
        res.status(400).json(error.message);
    }
};

exports.eliminarAula = async (req, res) => {
    try {
        const { id } = req.params;
        await classroomService.eliminarAula(id);
        res.json({ message: 'Aula eliminada exitosamente' });
    } catch (error) {
        res.status(400).json(error.message);
    }
};