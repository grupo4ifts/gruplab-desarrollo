import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuLab, UsuarioSession } from '../models/classroom';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  // Usa la sesion activa del localstorage para sacar el tipo de usuario (alumno o profesor)
  usuario = signal<UsuarioSession | null>(null);

  // Usa los AuLabs del localstorage para sacar las aulas del usuario y poder usarlas en el HTML
  misAuLabs = signal<AuLab[]>([]);

  // Inicializa el componente cuando se carga

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Metodo que carga los datos desde el servicio

  cargarDatos(): void {
    this.misAuLabs.set(this.classroomService.obtenerAuLabs());
    this.usuario.set(this.classroomService.obtenerSesion());
  }

  // Establece como activo el AuLab seleccionado y redirige al panel del aula

  entrarAAuLab(aulab: AuLab): void {
    this.classroomService.establecerAuLabActivo(aulab);
    this.router.navigate(['/classrooms', aulab.classroomId]);
  }

  // Elimina un AuLab del localstorage y cierra sesion si es el aula activa

  quitarAuLab(classroomId: number): void {
    this.classroomService.quitarAuLab(classroomId);
    if (this.usuario()?.classroomId === classroomId) {
      this.classroomService.cerrarSesion();
    }
    this.cargarDatos();
  }
}
