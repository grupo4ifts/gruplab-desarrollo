import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { CrearAulaResponse } from '../models/classroom';

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
    this.classroomService.crearAula(this.name(), this.duenio(), this.email()).subscribe({
      next: (respuesta: CrearAulaResponse) => {
        this.classroomService.establecerAuLabActivo({
          classroomId: respuesta.aulaId,
          nombreAula: this.name(),
          rol: 'profesor',
          nombreUsuario: this.duenio(),
          join_code: respuesta.join_code,
          memberId: respuesta.memberId
        });

        this.router.navigate(['/classrooms', respuesta.aulaId]);
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Error al crear el aula.');
      }
    });
  }
}
