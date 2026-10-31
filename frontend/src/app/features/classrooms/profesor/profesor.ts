import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profesor.html',
  styleUrl: './profesor.css'
})
export class Profesor {
  name = signal('');
  duenio = signal('');
  volver = output<void>();

  constructor(private classroomService: ClassroomService) { }

  crear() {
    this.classroomService.crearAula(this.name(), this.duenio()).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta.message);
        console.log('Comparti este codigo con tus alumnos:', respuesta.join_code);
        this.volver.emit();
      },
      error: (error: any) => console.error('Error al crear el aula:', error)
    });
  }
}