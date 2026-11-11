import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { CrearAulaResponse } from '../models/classroom';

/**
 * Componente del formulario para que un docente cree un aula nueva.
 * Envía la petición al backend, inicializa el AuLab con rol 'profesor' y redirige al panel.
 */
@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  // SIGNALS DEL FORMULARIO

  name = signal('');

  duenio = signal('');

  email = signal('');

  errorMsg = signal('');

  // Como profesor, se crea el aula mediante el completado del formulario y el envio de peticion al backend
  crear(): void {
    this.classroomService.crearAula(this.name(), this.duenio()).subscribe({
      next: (respuesta: CrearAulaResponse) => {
        this.classroomService.establecerAuLabActivo({
          classroomId: respuesta.aulaId,
          nombreAula: this.name(),
          rol: 'profesor',
          nombreUsuario: this.duenio(),
          join_code: respuesta.join_code,
          duenio: this.duenio(),
          memberId: respuesta.memberId
        });

        this.router.navigate(['/classrooms', respuesta.aulaId]);
      },
      error: (err: any) => {
        console.error('Error al crear el aula:', err);
        this.errorMsg.set(err.error?.error || 'Error al crear el aula.');
      }
    });
  }
}
