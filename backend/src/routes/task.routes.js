const { Router } = require('express');
const taskController = require('../controllers/task.controller');

const router = Router();

router.get('/tasks/:id', taskController.obtenerTareaPorId);
router.post('/tasks', taskController.crearTarea);
router.put('/tasks/:id', taskController.actualizarTarea);
router.delete('/tasks/:id', taskController.eliminarTarea);

module.exports = router;
