const { Router } = require('express')
const boardController = require('../controllers/board.controller')

const router = Router()

router.get('/groups/:groupId/board', boardController.obtenerTablero)
router.post('/groups/:groupId/columns', boardController.crearColumna)
router.put('/columns/:id', boardController.actualizarColumna)
router.delete('/columns/:id', boardController.eliminarColumna)
router.patch('/tasks/:id/column', boardController.moverTareaDeColumna)


module.exports = router




