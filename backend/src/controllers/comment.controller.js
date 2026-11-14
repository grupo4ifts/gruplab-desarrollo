const commentService = require('../services/comment.service')

exports.crearComentario = async (req, res) => {
    try {
        const { tareaID, autorName, contenido } = req.body

        //importo el servicio. ejecuto crearComentario con los argumentos
        const respuesta = await commentService.crearComentario(tareaID, autorName, contenido)

        res.status(200).json(respuesta.mensaje)

    } catch (error) {
        res.status(400).json(error)
    }


}