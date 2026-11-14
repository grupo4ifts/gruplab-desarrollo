const commentRepository =require('../repositories/comment.repository')
//verifico que tengo la tarea
exports.vetificoTarea =async (idTarea)=>{
    const tareaID = await commentRepository.obtenertarea(idTarea)

    if(tareaID.length === 0)
    {
         throw new Error('Error: La tarea no existe.')
    }
    else{
        return tareaID
    }
}

exports.crearComentario= async(tareaID,autorName,contenido) =>{

    const verificoTarea = await exports.vetificoTarea(tareaID) //accedo a la funcion exportada

    if(!autorName){
        throw new Error('Error: Falta el nombre del autor del comentario.')
    }
    if(!contenido.trim()){//verifico que los campos no esten vacíos o no tengan espacios
        throw new Error('Error: El comentario esta vacio. Verifique e intente nuevamente.')
    }
    if(contenido.length < 100 || contenido.length > 1000){
        throw new Error('Error: El comentario introducido esta fuera de rango establecido.')
    }

    return {mensaje:'Comentario Publicado con exito'}
}

exports.obtenerComentario= async() =>{}
exports.editarComentario= async() =>{}
exports.eliminarComentario= async() =>{}