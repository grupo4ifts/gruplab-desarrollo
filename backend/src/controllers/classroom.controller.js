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
        const { name, code, description } = req.body;
        await classroomService.crearAula(name, code, description);
        res.json({ message: 'Aula creada exitosamente' });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

exports.obtenerAulaPorCodigo = async (req, res) => {
    try {
        const { code } = req.params;
        const aula = await classroomService.obtenerAulaPorCodigo(code);
        res.json(aula);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

exports.eliminarAula = async (req, res) => {
    try {
        const { code } = req.params;
        await classroomService.eliminarAula(code);
        res.json({ message: 'Aula eliminada exitosamente' });
    } catch (error) {
        res.status(400).json(error.message);
    }
};