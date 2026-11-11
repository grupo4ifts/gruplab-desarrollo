import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { MemberList } from '../../members/member-list/member-list';
import { GroupList } from '../../groups/group-list/group-list';

@Component({
  selector: 'app-panel-aula',
  standalone: true,
  imports: [MemberList, GroupList],
  templateUrl: './panel-aula.html',
  styleUrl: './panel-aula.css'
})
export class PanelAula {
  aula = signal<any>(null);
  usuarioActual = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService
  ) {
    const rawUser = localStorage.getItem('gruplab_usuario');
    if (rawUser) {
      this.usuarioActual.set(JSON.parse(rawUser));
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.classroomService.obtenerAulaPorId(id).subscribe({
      next: (aula: any) => this.aula.set(aula),
      error: () => this.router.navigate(['/classrooms'])
    });
  }

  eliminarAula() {
    if (!confirm('¿Seguro que querés eliminar esta aula? Se perderán sus datos.')) {
      return;
    }

    this.classroomService.eliminarAula(this.aula().id).subscribe({
      next: () => {
        localStorage.removeItem('gruplab_usuario');
        this.router.navigate(['/classrooms']);
      },
      error: (err) => alert(err.error?.error || 'Error al eliminar el aula')
    });
  }

  volver() {
    this.router.navigate(['/classrooms']);
  }
}
