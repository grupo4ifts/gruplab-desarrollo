import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

 
  obtenerMiembrosPorAula(classroomId: number) {
    return this.http.get(`${this.apiUrl}/classrooms/${classroomId}/members`);
  }

  
  obtenerMiembrosPorGrupo(groupId: number) {
    return this.http.get(`${this.apiUrl}/groups/${groupId}/members`);
  }

  
  agregarMiembro(classroomId: number, nombre: string, rol: string = 'alumno', email?: string) {
    return this.http.post(`${this.apiUrl}/classrooms/${classroomId}/members`, { nombre, email, rol });
  }

  
  asignarGrupo(memberId: number, groupId: number | null) {
    return this.http.put(`${this.apiUrl}/members/${memberId}/group`, { group_id: groupId });
  }

  
  eliminarMiembro(memberId: number) {
    return this.http.delete(`${this.apiUrl}/members/${memberId}`);
  }
}
