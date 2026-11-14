
export interface Member {
  id: number;
  classroom_id: number;
  group_id: number | null;
  group_name: string | null;
  nombre: string;
  email: string | null;
  rol: 'profesor' | 'alumno';
  created_at: string;
}


export interface AgregarMiembroResponse {
  message: string;
  id: number;
}

export interface MemberMensajeResponse {
  message: string;
}


export interface GrupoDelAula {
  id: number;
  classroom_id: number;
  group_number: number;
  project_name: string;
}
