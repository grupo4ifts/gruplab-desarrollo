import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css'
})
export class AlumnoComponent {
  codigoAcceso = signal('');
  volver = output<void>();

  constructor(private classroomService: ClassroomService) { }

  validar() {
    this.classroomService.obtenerAulaPorCodigo(this.codigoAcceso()).subscribe({
      next: (aula: any) => {
      },
      error: (error: any) => {
        console.error('El codigo no existe', error);
        alert('Aula no encontrada.');
      }
    });
  }
}