import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { CrearAulaResponse } from '../models/classroom';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './profesor.html'
})
export class Profesor {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMsg = signal('');

  formulario = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    duenio: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email, Validators.maxLength(100)]]
  });

  crear(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { name, duenio, email } = this.formulario.getRawValue();
    const nombreAula = name.trim();
    const nombreProfesor = duenio.trim();
    const emailProfesor = email.trim() || undefined;

    this.classroomService.crearAula(nombreAula, nombreProfesor, emailProfesor).subscribe({
      next: (respuesta: CrearAulaResponse) => {
        this.classroomService.establecerAuLabActivo({
          classroomId: respuesta.aulaId,
          nombreAula,
          rol: 'profesor',
          nombreUsuario: nombreProfesor,
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
