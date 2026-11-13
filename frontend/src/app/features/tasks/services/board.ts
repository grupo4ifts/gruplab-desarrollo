import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearColumnaResponse, GrupoTablero, MensajeResponse, Tablero } from '../models/board-column';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  obtenerGrupo(groupId: number): Observable<GrupoTablero> {
    return this.http.get<GrupoTablero>(`${this.apiUrl}/groups/${groupId}`);
  }

  obtenerTablero(groupId: number): Observable<Tablero> {
    return this.http.get<Tablero>(`${this.apiUrl}/groups/${groupId}/board`);
  }

  crearColumna(groupId: number, name: string, color?: string): Observable<CrearColumnaResponse> {
    return this.http.post<CrearColumnaResponse>(`${this.apiUrl}/groups/${groupId}/columns`, { name, color });
  }

  actualizarColumna(columnId: number, name: string, color: string): Observable<MensajeResponse> {
    return this.http.put<MensajeResponse>(`${this.apiUrl}/columns/${columnId}`, { name, color });
  }

  eliminarColumna(columnId: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.apiUrl}/columns/${columnId}`);
  }

  moverTareaDeColumna(taskId: number, columnId: number): Observable<MensajeResponse> {
    return this.http.patch<MensajeResponse>(`${this.apiUrl}/tasks/${taskId}/column`, { column_id: columnId });
  }
}
