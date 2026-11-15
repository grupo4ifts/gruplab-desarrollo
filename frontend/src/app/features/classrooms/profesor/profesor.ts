import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom, CrearAulaResponse } from '../models/classroom';
import { MemberService } from '../../members/services/member';
import { Member } from '../../members/models/member';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './profesor.html'
})
export class Profesor {
  private classroomService = inject(ClassroomService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  modo = signal<'crear' | 'ingresar'>('crear');
  errorMsg = signal('');

  formulario = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    duenio: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email, Validators.maxLength(100)]]
  });

  formularioIngreso = this.fb.nonNullable.group({
    codigoAcceso: ['', [Validators.required]],
    duenio: ['', [Validators.required, Validators.maxLength(100)]]
  });

  cambiarModo(nuevoModo: 'crear' | 'ingresar'): void {
    this.modo.set(nuevoModo);
    this.errorMsg.set('');
  }

  crear(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.errorMsg.set('');
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

  ingresar(): void {
    if (this.formularioIngreso.invalid) {
      this.formularioIngreso.markAllAsTouched();
      return;
    }

    this.errorMsg.set('');
    const { codigoAcceso, duenio } = this.formularioIngreso.getRawValue();
    const nombreProfesor = duenio.trim();

    this.classroomService.obtenerAulaPorCodigo(codigoAcceso.trim()).subscribe({
      next: (aula: Classroom) => {
        this.memberService.obtenerMiembrosPorAula(aula.id).subscribe({
          next: (miembros: Member[]) => {
            const profesor = miembros.find(m =>
              m.rol === 'profesor' && m.nombre.trim().toLowerCase() === nombreProfesor.toLowerCase()
            );

            if (!profesor) {
              this.errorMsg.set('No se encontro un profesor con ese nombre en esta aula.');
              return;
            }

            this.classroomService.establecerAuLabActivo({
              classroomId: aula.id,
              nombreAula: aula.name,
              rol: 'profesor',
              nombreUsuario: profesor.nombre,
              join_code: aula.join_code,
              memberId: profesor.id
            });

            this.router.navigate(['/classrooms', aula.id]);
          },
          error: (err: any) => {
            this.errorMsg.set(err.error?.error || 'No se pudieron verificar los miembros del aula.');
          }
        });
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Aula no encontrada.');
      }
    });
  }
}
