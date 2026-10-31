import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-panel-aula',
  standalone: true,
  imports: [],
  templateUrl: './panel-aula.html',
  styleUrl: './panel-aula.css'
})
export class PanelAula {
  aula = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.classroomService.obtenerAulaPorId(id).subscribe({
      next: (aula: any) => this.aula.set(aula),
      error: (error: any) => {
        console.error('Aula no encontrada', error);
        this.router.navigate(['/classrooms']);
      }
    });
  }

  volver() {
    this.router.navigate(['/classrooms']);
  }
}
