import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgregarMiembroResponse, Member, MemberMensajeResponse } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  

  obtenerMiembrosPorAula(classroomId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/classrooms/${classroomId}/members`);
  }

 

  obtenerMiembrosPorGrupo(groupId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/groups/${groupId}/members`);
  }

  

  agregarMiembro(classroomId: number, nombre: string, rol: string = 'alumno', email?: string): Observable<AgregarMiembroResponse> {
    return this.http.post<AgregarMiembroResponse>(`${this.apiUrl}/classrooms/${classroomId}/members`, { nombre, email, rol });
  }

 

  asignarGrupo(memberId: number, groupId: number | null): Observable<MemberMensajeResponse> {
    return this.http.put<MemberMensajeResponse>(`${this.apiUrl}/members/${memberId}/group`, { group_id: groupId });
  }

 

  eliminarMiembro(memberId: number): Observable<MemberMensajeResponse> {
    return this.http.delete<MemberMensajeResponse>(`${this.apiUrl}/members/${memberId}`);
  }
}
