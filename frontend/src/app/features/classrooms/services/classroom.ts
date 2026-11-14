import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classroom, CrearAulaResponse, EliminarAulaResponse, AuLab, UsuarioSession } from '../models/classroom';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/classrooms';

  private readonly KEY_USUARIO = 'gruplab_usuario';
  private readonly KEY_AULABS = 'gruplab_mis_aulabs';

  crearAula(name: string, duenio: string, email?: string): Observable<CrearAulaResponse> {
    const body = { name, duenio, email };
    return this.http.post<CrearAulaResponse>(this.apiUrl, body);
  }

  obtenerAulaPorCodigo(join_code: string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/code/${join_code}`);
  }

  obtenerAulaPorId(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`);
  }

  eliminarAula(id: number): Observable<EliminarAulaResponse> {
    return this.http.delete<EliminarAulaResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerSesion(): UsuarioSession | null {
    const data = localStorage.getItem(this.KEY_USUARIO);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  guardarSesion(usuario: UsuarioSession): void {
    localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.KEY_USUARIO);
  }

  obtenerAuLabs(): AuLab[] {
    const data = localStorage.getItem(this.KEY_AULABS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  guardarAuLab(aulab: AuLab): void {
    const aulabs = this.obtenerAuLabs();
    const idx = aulabs.findIndex(e => e.classroomId === aulab.classroomId);
    if (idx >= 0) {
      aulabs[idx] = aulab;
    } else {
      aulabs.push(aulab);
    }
    localStorage.setItem(this.KEY_AULABS, JSON.stringify(aulabs));
  }

  quitarAuLab(classroomId: number): void {
    const aulabs = this.obtenerAuLabs().filter(e => e.classroomId !== classroomId);
    localStorage.setItem(this.KEY_AULABS, JSON.stringify(aulabs));
  }

  obtenerAuLabPorId(classroomId: number): AuLab | undefined {
    return this.obtenerAuLabs().find(e => e.classroomId === classroomId);
  }

  establecerAuLabActivo(aulab: AuLab): void {
    this.guardarAuLab(aulab);
    this.guardarSesion({
      nombre: aulab.nombreUsuario,
      rol: aulab.rol,
      classroomId: aulab.classroomId,
      classroomName: aulab.nombreAula,
      memberId: aulab.memberId
    });
  }
}
