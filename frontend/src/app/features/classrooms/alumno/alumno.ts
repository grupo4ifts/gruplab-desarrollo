import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './alumno.html'
})
export class Alumno {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  codigoAcceso = signal('');

  nombre = signal('');

  email = signal('');

  errorMsg = signal('');

  validar(): void {
    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso()).subscribe({
      next: (aula: Classroom) => {
        this.classroomService.establecerAuLabActivo({
          classroomId: aula.id,
          nombreAula: aula.name,
          rol: 'alumno',
          nombreUsuario: this.nombre().trim() || 'Alumno',
          join_code: aula.join_code
        });

        this.router.navigate(['/classrooms', aula.id]);
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Aula no encontrada.');
      }
    });
  }
}
