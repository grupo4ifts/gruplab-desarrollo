import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  obtenerGrupos(classroomId: number) {
    return this.http.get(`${this.apiUrl}/classrooms/${classroomId}/groups`);
  }

  crearGrupo(classroomId: number, project_name: string) {
    return this.http.post(`${this.apiUrl}/classrooms/${classroomId}/groups`, { project_name });
  }

  obtenerGrupoPorId(id: number) {
    return this.http.get(`${this.apiUrl}/groups/${id}`);
  }

  actualizarGrupo(id: number, project_name: string) {
    return this.http.put(`${this.apiUrl}/groups/${id}`, { project_name });
  }

  eliminarGrupo(id: number) {
    return this.http.delete(`${this.apiUrl}/groups/${id}`);
  }
}

