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

  // Metodos HTTP


  // Crea una nueva aula en el servidor y registra al creador como profesor y devuelve el Observable con el id generado, codigo de acceso y mensaje de exito

  crearAula(name: string, duenio: string): Observable<CrearAulaResponse> {
    const body = { name, duenio };
    return this.http.post<CrearAulaResponse>(this.apiUrl, body);
  }

  // Busca el aula mediante el codigo ingresado por fomulario (join_code) y devuelve el Observable con el aula

  obtenerAulaPorCodigo(join_code: string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/code/${join_code}`);
  }

  // Busca aulas por id y devuelve el observable con el aula

  obtenerAulaPorId(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`);
  }

  // Elimina aulas por id y devuelve el observable con el mensaje de confirmacion

  eliminarAula(id: number): Observable<EliminarAulaResponse> {
    return this.http.delete<EliminarAulaResponse>(`${this.apiUrl}/${id}`);
  }

  // LOCALSTORAGE (Guarda la informacion en texto, mediante clave y valor en el navegador. Toda solicitud al localStorage se tiene que convertir del texto a objeto mediante JSON.parse(), porque si se accede a cualquier metodo del localStorage se retorna texto))

  // Obtiene la sesion activa y devuelve el observable mediante la clave "gruplab_usuario" generada en los servicios

  obtenerSesion(): UsuarioSession | null {
    const data = localStorage.getItem(this.KEY_USUARIO);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  // Guarda la sesion activa y devuelve el observable mediante la clave "gruplab_usuario" generada en los servicios

  guardarSesion(usuario: UsuarioSession): void {
    localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
  }

  // Elimina la sesion activa y devuelve el observable mediante la clave "gruplab_usuario" generada en los servicios

  cerrarSesion(): void {
    localStorage.removeItem(this.KEY_USUARIO);
  }

  // Trae las aulas guardadas del usuario que esta activo en memoria (LocalStorage)

  obtenerAuLabs(): AuLab[] {
    const data = localStorage.getItem(this.KEY_AULABS) || localStorage.getItem('gruplab_mis_espacios');
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Guarda las aulas en memoria

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

  // Quitar aula de la memoria

  quitarAuLab(classroomId: number): void {
    const aulabs = this.obtenerAuLabs().filter(e => e.classroomId !== classroomId);
    localStorage.setItem(this.KEY_AULABS, JSON.stringify(aulabs));
  }

  // Trae el aula que coincide con el id y lo devuelve

  obtenerAuLabPorId(classroomId: number): AuLab | undefined {
    return this.obtenerAuLabs().find(e => e.classroomId === classroomId);
  }

  // Establecer aula activa

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
