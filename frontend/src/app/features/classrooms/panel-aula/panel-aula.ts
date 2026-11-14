import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom, UsuarioSession } from '../models/classroom';

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

  aula = signal<Classroom | null>(null);

  usuario = signal<UsuarioSession | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);

      const miAuLab = this.classroomService.obtenerAuLabPorId(id);
      if (miAuLab) {
        this.classroomService.establecerAuLabActivo(miAuLab);
      }
      this.usuario.set(this.classroomService.obtenerSesion());

      this.classroomService.obtenerAulaPorId(id).subscribe({
        next: (aula: Classroom) => this.aula.set(aula),
        error: (error: any) => {
          this.router.navigate(['/classrooms']);
        }
      });
    });
  }

  eliminar(): void {
    const aulaActual = this.aula();
    if (!aulaActual) return;

    if (confirm(`Estas seguro de que deseas eliminar el aula "${aulaActual.name}"?`)) {
      this.classroomService.eliminarAula(aulaActual.id).subscribe({
        next: () => {
          this.classroomService.quitarAuLab(aulaActual.id);
          this.classroomService.cerrarSesion();
          this.router.navigate(['/classrooms']);
        },
        error: (error: any) => {
          alert('No se pudo eliminar el aula');
        }
      });
    }
  }
}
