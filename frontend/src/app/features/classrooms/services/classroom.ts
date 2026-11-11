import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classroom, CrearAulaResponse, EliminarAulaResponse } from '../models/classroom';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/classrooms';

  crearAula(name: string, duenio: string): Observable<CrearAulaResponse> {
    const body = { name, duenio };
    return this.http.post<CrearAulaResponse>(this.apiUrl, body);
  }

  obtenerAulaPorCodigo(join_code: string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/code/${join_code}`);
  }

  obtenerAulas(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.apiUrl);
  }

  obtenerAulaPorId(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`);
  }

  eliminarAula(id: number): Observable<EliminarAulaResponse> {
    return this.http.delete<EliminarAulaResponse>(`${this.apiUrl}/${id}`);
  }
}
