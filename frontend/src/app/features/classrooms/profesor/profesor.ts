import { Component, signal, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { CrearAulaResponse } from '../models/classroom';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  name = signal('');
  duenio = signal('');
  email = signal('');
  errorMsg = signal('');
  volver = output<void>();

  crear() {
    this.classroomService.crearAula(this.name(), this.duenio()).subscribe({
      next: (respuesta: CrearAulaResponse) => {
        this.router.navigate(['/classrooms', respuesta.aulaId]);
      },
      error: (error: any) => {
        console.error('Error al crear el aula:', error);
        this.errorMsg.set('Error al crear el aula.');
      }
    });
  }
}
