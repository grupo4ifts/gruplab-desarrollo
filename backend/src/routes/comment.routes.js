const { Router } = require('express')
const commentController = require('../controllers/comment.controller')

const router = Router()

router.post('/comments', commentController.crearComentario)

module.exports = router