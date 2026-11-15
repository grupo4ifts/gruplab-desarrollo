export interface Group {
  id: number;
  classroom_id: number;
  group_number: number;
  project_name: string;
}

export interface CrearGrupoResponse {
  message: string;
  group_number: number;
}

export interface MensajeResponse {
  message: string;
}
