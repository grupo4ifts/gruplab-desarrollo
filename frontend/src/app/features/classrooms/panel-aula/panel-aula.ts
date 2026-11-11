import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom, UsuarioSession } from '../models/classroom';

/**
 * Componente principal del panel de control de un aula específica.
 * Carga los detalles del aula a partir del parámetro ':id' de la ruta,
 * administra permisos según el rol ('profesor' / 'alumno') y aloja las secciones de grupos y miembros.
 */
@Component({
  selector: 'app-panel-aula',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './panel-aula.html',
  styleUrl: './panel-aula.css'
})
export class PanelAula implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private classroomService = inject(ClassroomService);

  // Datos del aula en la que estamos
  aula = signal<Classroom | null>(null);

  // Sesion activa y rol correspondiente
  usuario = signal<UsuarioSession | null>(null);

  ngOnInit(): void {
    // Suscribe a los parametros de la URL para obtener el :id del aula
    this.route.params.subscribe(params => {
      const id = Number(params['id']);

      // Sincroniza el rol del usuario si ya tiene este AuLab registrado
      const miAuLab = this.classroomService.obtenerAuLabPorId(id);
      if (miAuLab) {
        this.classroomService.establecerAuLabActivo(miAuLab);
      }
      this.usuario.set(this.classroomService.obtenerSesion());

      // Consulta la informacion del aula al backend
      this.classroomService.obtenerAulaPorId(id).subscribe({
        next: (aula: Classroom) => this.aula.set(aula),
        error: (error: any) => {
          console.error('Aula no encontrada', error);
          this.router.navigate(['/classrooms']);
        }
      });
    });
  }

  // Elimina el aula en la que estamos parados

  eliminar(): void {
    const aulaActual = this.aula();
    if (!aulaActual) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el aula "${aulaActual.name}"?`)) {
      this.classroomService.eliminarAula(aulaActual.id).subscribe({
        next: () => {
          this.classroomService.quitarAuLab(aulaActual.id);
          this.classroomService.cerrarSesion();
          this.router.navigate(['/classrooms']);
        },
        error: (error: any) => {
          console.error('Error al eliminar el aula', error);
          alert('No se pudo eliminar el aula');
        }
      });
    }
  }
}
