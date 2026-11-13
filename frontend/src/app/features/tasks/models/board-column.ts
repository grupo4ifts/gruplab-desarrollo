import { Task } from './task';

export interface BoardColumn {
  id: number;
  group_id: number;
  name: string;
  position: number;
  color: string;
}

export interface Tablero {
  columns: BoardColumn[];
  tasks: Task[];
}

export interface GrupoTablero {
  id: number;
  classroom_id: number;
  group_number: number;
  project_name: string;
}

export interface CrearColumnaResponse {
  message: string;
  id: number;
  position: number;
}

export interface MensajeResponse {
  message: string;
}
