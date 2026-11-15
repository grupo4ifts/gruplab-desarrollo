const { Router } = require('express');
const commentController = require('../controllers/comment.controller');

const router = Router();

router.post('/comments', commentController.crearComentario);
router.get('/tasks/:tareaID/comments', commentController.obtenerComentario);
router.put('/comments/:comentarioID', commentController.editarComentario);
router.delete('/comments/:comentarioID', commentController.eliminarComentario);

module.exports = router;