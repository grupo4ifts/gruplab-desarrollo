import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';
import { MemberService } from '../../members/services/member';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './alumno.html'
})
export class Alumno {
  private classroomService = inject(ClassroomService);
  private memberService = inject(MemberService);
  private router = inject(Router);

  codigoAcceso = signal('');

  nombre = signal('');

  email = signal('');

  errorMsg = signal('');

  validar(): void {
    const nombreUsuario = this.nombre().trim() || 'Alumno';
    const emailUsuario = this.email().trim() || undefined;

    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso()).subscribe({
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
