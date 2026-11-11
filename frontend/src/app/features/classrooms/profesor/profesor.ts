import { Component, signal, output } from '@angular/core';
import { Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor {
  name = signal('');
  duenio = signal('');
  email = signal('');
  errorMsg = signal('');
  volver = output<void>();

  constructor(
    private classroomService: ClassroomService,
    private router: Router
  ) { }

  crear() {
    this.errorMsg.set('');

    if (!this.name() || !this.duenio()) {
      this.errorMsg.set('El nombre del aula y del profesor son obligatorios');
      return;
    }

    this.classroomService.crearAula(this.name(), this.duenio(), this.email()).subscribe({
      next: (respuesta: any) => {
        // 1. Guardar sesión activa
        localStorage.setItem('gruplab_usuario', JSON.stringify({
          nombre: this.duenio(),
          rol: 'profesor',
          classroomId: respuesta.aulaId
        }));

        // 2. Guardar en "Mis Aulas"
        const misAulas = JSON.parse(localStorage.getItem('gruplab_mis_aulas') || '[]');
        if (!misAulas.some((a: any) => a.id === respuesta.aulaId)) {
          misAulas.push({
            id: respuesta.aulaId,
            name: this.name(),
            duenio: this.duenio(),
            join_code: respuesta.join_code,
            rol: 'profesor',
            miNombre: this.duenio()
          });
          localStorage.setItem('gruplab_mis_aulas', JSON.stringify(misAulas));
        }

        this.router.navigate(['/classrooms', respuesta.aulaId]);
      },
      error: (err: any) => {
        this.errorMsg.set(err.error?.error || 'Error al crear el aula');
      }
    });
  }
}
