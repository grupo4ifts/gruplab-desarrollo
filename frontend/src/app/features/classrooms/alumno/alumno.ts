import { Component, signal, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css'
})
export class Alumno {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  codigoAcceso = signal('');
  nombre = signal('');
  email = signal('');
  errorMsg = signal('');
  volver = output<void>();

  validar() {
    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso()).subscribe({
      next: (aula: Classroom) => {
        console.log(`Aula encontrada: ${aula.name}`);
        this.router.navigate(['/classrooms', aula.id]);
      },
      error: (error: any) => {
        console.error('El codigo no existe', error);
        this.errorMsg.set('Aula no encontrada.');
      }
    });
  }
}
