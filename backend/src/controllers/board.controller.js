const boardService = require('../services/board.service')


exports.obtenerTablero = async (req, res) => {
    try {
        const { groupId } = req.params;
        const resultado = await boardService.obtenerTablero(groupId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
exports.crearColumna = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, color } = req.body || {};
        const resultado = await boardService.crearColumna(groupId, name, color);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
exports.actualizarColumna = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body || {};
        const resultado = await boardService.actualizarColumna(id, name, color);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
exports.eliminarColumna = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await boardService.eliminarColumna(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 
exports.moverTareaDeColumna = async (req, res) => {
    try {
        const { id } = req.params;
        const { column_id } = req.body || {};
        const resultado = await boardService.moverTareaDeColumna(id, column_id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};