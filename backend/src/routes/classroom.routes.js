const { Router } = require('express');
const classroomController = require('../controllers/classroom.controller');

const router = Router();

router.get('/classrooms', classroomController.obtenerAulas);
router.post('/classrooms', classroomController.crearAula);
router.get('/classrooms/:code', classroomController.obtenerAulaPorCodigo);
router.delete('/classrooms/:code', classroomController.eliminarAula);

module.exports = router;