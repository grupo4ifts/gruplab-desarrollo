import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Classroom } from '../models/classroom';

@Component({
  selector: 'app-panel-aula',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './panel-aula.html',
  styleUrl: './panel-aula.css'
})
export class PanelAula {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private classroomService = inject(ClassroomService);

  aula = signal<Classroom | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.classroomService.obtenerAulaPorId(id).subscribe({
      next: (aula: Classroom) => this.aula.set(aula),
      error: (error: any) => {
        console.error('Aula no encontrada', error);
        this.router.navigate(['/classrooms']);
      }
    });
  }
}
