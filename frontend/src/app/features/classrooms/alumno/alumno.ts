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
  volver = output<void>();

  constructor(private classroomService: ClassroomService, private router: Router) { }

  validar() {
    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso()).subscribe({
      next: (aula: any) => {
        console.log(`Aula encontrada: ${aula.name}`);
        this.router.navigate(['/classrooms', aula.id]);
      },
      error: (error: any) => {
        console.error('El codigo no existe', error);
        alert('Aula no encontrada.');
      }
    });
  }
}