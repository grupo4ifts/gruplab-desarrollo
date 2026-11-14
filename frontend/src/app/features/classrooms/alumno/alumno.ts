import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css'
})
export class Alumno {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  // SIGNALS DEL FORMULARIO

  codigoAcceso = signal('');

  nombre = signal('');

  email = signal('');

  errorMsg = signal('');

  // Valida el codigo ingresado por el alumno mediante suscripcion al servicio de classroom, luego establece el AuLab activo y redirige al aula si es correcto

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
