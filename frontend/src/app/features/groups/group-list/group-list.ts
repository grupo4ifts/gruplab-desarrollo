import { Component, input, signal, OnInit } from '@angular/core';
import { GroupService } from '../services/group';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [],
  templateUrl: './group-list.html',
  styleUrl: './group-list.css'
})
export class GroupList implements OnInit {
  classroomId = input.required<number>();
  grupos = signal<any[]>([]);
  nuevoNombre = signal('');
  errorMsg = signal('');

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.groupService.obtenerGrupos(this.classroomId()).subscribe({
      next: (data: any) => this.grupos.set(data),
      error: () => this.errorMsg.set('Error al cargar grupos')
    });
  }

  crear() {
    this.errorMsg.set('');
    if (!this.nuevoNombre().trim()) {
      this.errorMsg.set('El nombre del proyecto es obligatorio');
      return;
    }

    this.groupService.crearGrupo(this.classroomId(), this.nuevoNombre().trim()).subscribe({
      next: () => {
        this.nuevoNombre.set('');
        this.cargarGrupos();
      },
      error: (err: any) => this.errorMsg.set(err.error?.error || 'Error al crear grupo')
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este grupo?')) return;
    this.groupService.eliminarGrupo(id).subscribe({
      next: () => this.cargarGrupos(),
      error: (err: any) => alert(err.error?.error || 'Error al eliminar grupo')
    });
  }
}

