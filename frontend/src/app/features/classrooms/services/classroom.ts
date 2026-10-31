import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:3000/classrooms';
  constructor(private http: HttpClient) { }

  crearAula(name: string, duenio: string): Observable<any> {
    const body = { name, duenio };
    return this.http.post(this.apiUrl, body);
  }

  obtenerAulaPorCodigo(join_code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/code/${join_code}`);
  }

  obtenerAulas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerAulaPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  eliminarAula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}