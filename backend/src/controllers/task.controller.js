const taskService = require('../services/task.service');

exports.obtenerTareaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await taskService.obtenerTareaPorId(id);
        res.status(200).json(tarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.crearTarea = async (req, res) => {
    try {
        const { group_id, column_id, assigned_to, title, description } = req.body || {};
        const resultado = await taskService.crearTarea(group_id, column_id, assigned_to, title, description);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assigned_to } = req.body || {};
        const resultado = await taskService.actualizarTarea(id, title, description, assigned_to);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await taskService.eliminarTarea(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
