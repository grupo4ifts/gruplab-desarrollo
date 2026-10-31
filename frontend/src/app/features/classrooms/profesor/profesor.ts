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
  volver = output<void>();

  constructor(
    private classroomService: ClassroomService,
    private router: Router
  ) { }

  crear() {
    this.classroomService.crearAula(this.name(), this.duenio()).subscribe({
      next: (respuesta: any) => {
        this.router.navigate(['/classrooms', respuesta.aulaId]);
      },
      error: (error: any) => console.error('Error al crear el aula:', error)
    });
  }
}
