const { Router } = require('express');
const memberController = require('../controllers/member.controller');
const router = Router();

router.get('/classrooms/:classroomId/members', memberController.obtenerMiembrosPorAula);
router.post('/classrooms/:classroomId/members', memberController.agregarMiembro);
router.get('/groups/:groupId/members', memberController.obtenerMiembrosPorGrupo);
router.put('/members/:id/group', memberController.asignarGrupo);
router.delete('/members/:id', memberController.eliminarMiembro);

module.exports = router;