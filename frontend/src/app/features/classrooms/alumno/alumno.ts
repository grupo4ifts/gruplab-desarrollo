import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';
import { MemberService } from '../../members/services/member';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './alumno.html'
})
export class Alumno {
  private classroomService = inject(ClassroomService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMsg = signal('');

  formulario = this.fb.nonNullable.group({
    codigoAcceso: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email, Validators.maxLength(100)]]
  });

  validar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { codigoAcceso, nombre, email } = this.formulario.getRawValue();
    const nombreUsuario = nombre.trim();
    const emailUsuario = email.trim() || undefined;

    this.classroomService.obtenerAulaPorCodigo(codigoAcceso.trim()).subscribe({
      next: (aula: Classroom) => {
        this.memberService.agregarMiembro(aula.id, nombreUsuario, 'alumno', emailUsuario).subscribe({
          next: (resp) => {
            this.classroomService.establecerAuLabActivo({
              classroomId: aula.id,
              nombreAula: aula.name,
              rol: 'alumno',
              nombreUsuario,
              join_code: aula.join_code,
              memberId: resp.id
            });

            this.router.navigate(['/classrooms', aula.id]);
          },
          error: (err: any) => {
            this.errorMsg.set(err.error?.error || 'No se pudo registrar el alumno en el aula.');
          }
        });
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Aula no encontrada.');
      }
    });
  }
}
