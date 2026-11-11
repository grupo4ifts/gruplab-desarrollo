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
}

export interface EliminarAulaResponse {
  message: string;
}

