export interface Classroom {
  id: number;
  name: string;
  duenio: string;
  join_code: string;
}

export interface CrearAulaResponse {
  message: string;
  aulaId: number;
  join_code: string;
  memberId?: number;
}

export interface EliminarAulaResponse {
  message: string;
}

export interface UsuarioSession {
  nombre: string;
  rol: 'profesor' | 'alumno';
  classroomId: number;
  classroomName?: string;
  memberId?: number;
}

export interface AuLab {
  classroomId: number;
  nombreAula: string;
  rol: 'profesor' | 'alumno';
  nombreUsuario: string;
  join_code?: string;
  memberId?: number;
}
