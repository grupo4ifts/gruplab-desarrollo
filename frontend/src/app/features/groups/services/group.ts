import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, CrearGrupoResponse, MensajeResponse } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  obtenerGrupos(classroomId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/classrooms/${classroomId}/groups`);
  }

  crearGrupo(classroomId: number, projectName: string): Observable<CrearGrupoResponse> {
    return this.http.post<CrearGrupoResponse>(`${this.apiUrl}/classrooms/${classroomId}/groups`, { project_name: projectName });
  }

  actualizarGrupo(id: number, projectName: string): Observable<MensajeResponse> {
    return this.http.put<MensajeResponse>(`${this.apiUrl}/groups/${id}`, { project_name: projectName });
  }

  eliminarGrupo(id: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.apiUrl}/groups/${id}`);
  }
}
