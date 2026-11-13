const {router} = require('express')
const boardController = require('../controllers/board.controller')

const router = Router()

app.get('/groups/:groupId/board', boardController.obtenerTablero) 
app.post('/groups/:groupId/columns', boardController.crearColumna)  
app.put('/columns/:id', boardController.actualizarColumna)  
app.delete('/columns/:id', boardController.eliminarColumna) 
app.patch('/tasks/:id/column', boardController.moverTareaDeColumna) 


module.exports = router




