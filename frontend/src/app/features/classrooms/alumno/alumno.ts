import { Component, signal, output } from '@angular/core';
import { ClassroomService } from '../services/classroom';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css'
})
export class Alumno {
  codigoAcceso = signal('');
  nombre = signal('');
  email = signal('');
  errorMsg = signal('');
  volver = output<void>();

  constructor(
    private classroomService: ClassroomService,
    private router: Router
  ) { }

  validar() {
    this.errorMsg.set('');

    if (!this.codigoAcceso() || !this.nombre()) {
      this.errorMsg.set('El código de acceso y tu nombre son obligatorios');
      return;
    }

    // 1. Busca el aula por código
    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso().trim()).subscribe({
      next: (aula: any) => {
        // 2. Registra al alumno como miembro en esa aula
        this.classroomService.agregarMiembro(aula.id, this.nombre().trim(), this.email().trim(), 'alumno').subscribe({
          next: () => {
            // Guardar sesión activa
            localStorage.setItem('gruplab_usuario', JSON.stringify({
              nombre: this.nombre(),
              rol: 'alumno',
              classroomId: aula.id
            }));

            // Guardar en "Mis Aulas"
            const misAulas = JSON.parse(localStorage.getItem('gruplab_mis_aulas') || '[]');
            if (!misAulas.some((a: any) => a.id === aula.id)) {
              misAulas.push({
                id: aula.id,
                name: aula.name,
                duenio: aula.duenio,
                join_code: aula.join_code,
                rol: 'alumno',
                miNombre: this.nombre()
              });
              localStorage.setItem('gruplab_mis_aulas', JSON.stringify(misAulas));
            }

            this.router.navigate(['/classrooms', aula.id]);
          },
          error: (err: any) => {
            this.errorMsg.set(err.error?.error || 'Error al registrarte en el aula');
          }
        });
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Código no encontrado');
      }
    });
  }
}
