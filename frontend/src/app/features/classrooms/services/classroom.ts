import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:3000/classrooms';

  constructor(private http: HttpClient) { }

  crearAula(name: string, duenio: string) {
    const body = { name, duenio };
    return this.http.post(this.apiUrl, body);
  }

  obtenerAulaPorCodigo(join_code: string) {
    return this.http.get(`${this.apiUrl}/code/${join_code}`);
  }

  obtenerAulas() {
    return this.http.get(this.apiUrl);
  }

  obtenerAulaPorId(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  eliminarAula(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
