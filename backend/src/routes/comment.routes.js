const { Router } = require('express')
const commentController = require('../controllers/comment.controller')

const router = Router()

router.post('/comments', commentController.crearComentario) //crear el comentario de una tarea

router.get('/tasks/:tareaID/comments', commentController.obtenerComentario) //Obtener los comentarios de una tarea

router.put('/comments/:comentarioID', commentController.editarComentario) //Editar un comentario

router.delete('/comments/:comentarioID', commentController.eliminarComentario) //Eliminar un comentario

module.exports = router //Exporto el router para que pueda ser utilizado en otros archivos