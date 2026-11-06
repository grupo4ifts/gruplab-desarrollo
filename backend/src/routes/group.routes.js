const { Router } = require('express');
const groupController = require('../controllers/group.controller');

const router = Router();

router.get('/classrooms/:classroomId/groups', groupController.obtenerGruposPorAula);
router.post('/classrooms/:classroomId/groups', groupController.crearGrupo);
router.get('/groups/:id', groupController.obtenerGrupoPorId);
router.put('/groups/:id', groupController.actualizarGrupo);
router.delete('/groups/:id', groupController.eliminarGrupo);

module.exports = router;
