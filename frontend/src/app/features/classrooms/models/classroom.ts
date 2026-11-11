// INTERFACES UTILIZADAS

// Modelo de lo que devuelve el backend al pedir las aulas
export interface Classroom {
  id: number;
  name: string;
  duenio: string;
  join_code: string;
}

// Modelo de lo que devuelve el backend al crear un aula
export interface CrearAulaResponse {
  message: string;
  aulaId: number;
  join_code: string;
  memberId?: number;
}

// Generaliza las respuestas del backend con un simple mensaje (eliminar, salir, etc.)
export interface EliminarAulaResponse {
  message: string;
}

// Lo que se guarda del usuario en el localStorage

export interface UsuarioSession {
  nombre: string;
  rol: 'profesor' | 'alumno';
  classroomId: number;
  classroomName?: string;
  memberId?: number;
}

// Todos los campos que vienen de la DB y que se utilizan en el localStorage. Por ejemplo: id, name, duenio, join_code de la db y nombreAula, nombreUsuario del frontend

export interface AuLab {
  classroomId: number;
  nombreAula: string;
  rol: 'profesor' | 'alumno';
  nombreUsuario: string;
  join_code?: string;
  memberId?: number;
}
