const commentService = require('../services/comment.service')

exports.crearComentario = async (req, res) => {
    try {
        const { tareaID, autorName, contenido } = req.body // obtengo los datos del comentario desde el body que se envia desde el front
        const respuesta = await commentService.crearComentario(tareaID, autorName, contenido) //importo el servicio. ejecuto crearComentario con los argumentos
        res.status(200).json(respuesta.mensaje)

    } catch (error) {
        res.status(400).json({ mensaje: error.message })
    }
}

exports.obtenerComentario = async (req, res) => {
    try {
        const { tareaID } = req.params
        const respuesta = await commentService.obtenerComentario(tareaID)
        res.status(200).json(respuesta)

    } catch (error) {
        res.status(400).json({ mensaje: error.message })
    }
}

exports.editarComentario = async (req, res) => {
    try {
        const { comentarioID } = req.params
        const { autorName, contenido } = req.body

        const respuesta = await commentService.editarComentario(
            comentarioID,
            autorName,
            contenido
        )
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(400).json({ mensaje: error.message })
    }
}

exports.eliminarComentario = async (req, res) => {
    try {
        const { comentarioID } = req.params
        const { autorName } = req.body

        const respuesta = await commentService.eliminarComentario(
            comentarioID,
            autorName
        )

        res.status(200).json(respuesta)

    } catch (error) {
        res.status(400).json({ mensaje: error.message })
    }
}