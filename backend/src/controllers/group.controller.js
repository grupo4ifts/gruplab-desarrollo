const groupService = require('../services/group.service');

exports.obtenerGruposPorAula = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const resultado = await groupService.obtenerGruposPorAula(classroomId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.crearGrupo = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { project_name } = req.body || {};
        const resultado = await groupService.crearGrupo(classroomId, project_name);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerGrupoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await groupService.obtenerGrupoPorId(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_name } = req.body || {};
        const resultado = await groupService.actualizarGrupo(id, project_name);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await groupService.eliminarGrupo(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
