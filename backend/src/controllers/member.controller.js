const memberService = require('../services/member.service');


exports.obtenerMiembrosPorAula = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const miembros = await memberService.obtenerMiembrosPorAula(classroomId);
        res.status(200).json(miembros);           
    } catch (error) {        
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerMiembrosPorGrupo = async (req, res) => {
    try {
        const { groupId } = req.params;
        const miembros = await memberService.obtenerMiembrosPorGrupo(groupId);
        res.status(200).json(miembros);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.agregarMiembro = async (req, res) => {
    try {
        const { classroomId } = req.params;     
        const { nombre, email, rol } = req.body || {};
        const resultado = await memberService.agregarMiembro(classroomId, nombre, email, rol);
        res.status(200).json(resultado);           
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.asignarGrupo = async (req, res) => {
    try {
        const { id } = req.params;                 
        const { group_id } = req.body || {};       
        const resultado = await memberService.asignarGrupo(id, group_id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.eliminarMiembro = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await memberService.eliminarMiembro(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};