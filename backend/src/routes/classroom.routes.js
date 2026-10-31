const { Router } = require('express');
const classroomController = require('../controllers/classroom.controller');

const router = Router();

router.get('/classrooms', classroomController.obtenerAulas);
router.post('/classrooms', classroomController.crearAula);
router.get('/classrooms/code/:join_code', classroomController.obtenerAulaPorCodigo);
router.get('/classrooms/:id', classroomController.obtenerAulaPorId);
router.delete('/classrooms/:id', classroomController.eliminarAula);


module.exports = router;