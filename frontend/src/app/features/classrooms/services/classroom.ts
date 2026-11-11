import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // AULAS
  crearAula(name: string, duenio: string, email?: string) {
    const body = { name, duenio, email };
    return this.http.post(`${this.apiUrl}/classrooms`, body);
  }

  obtenerAulaPorCodigo(join_code: string) {
    return this.http.get(`${this.apiUrl}/classrooms/code/${join_code}`);
  }

  obtenerAulas() {
    return this.http.get(`${this.apiUrl}/classrooms`);
  }

  obtenerAulaPorId(id: number) {
    return this.http.get(`${this.apiUrl}/classrooms/${id}`);
  }

  eliminarAula(id: number) {
    return this.http.delete(`${this.apiUrl}/classrooms/${id}`);
  }

  // MIEMBROS
  obtenerMiembrosPorAula(classroomId: number) {
    return this.http.get(`${this.apiUrl}/classrooms/${classroomId}/members`);
  }

  agregarMiembro(classroomId: number, nombre: string, email?: string, rol: string = 'alumno') {
    return this.http.post(`${this.apiUrl}/classrooms/${classroomId}/members`, { nombre, email, rol });
  }

  // GRUPOS
  obtenerGruposPorAula(classroomId: number) {
    return this.http.get(`${this.apiUrl}/classrooms/${classroomId}/groups`);
  }

  crearGrupo(classroomId: number, project_name: string) {
    return this.http.post(`${this.apiUrl}/classrooms/${classroomId}/groups`, { project_name });
  }
}
