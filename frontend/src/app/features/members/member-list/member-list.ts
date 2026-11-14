import { Component, OnInit, computed, input, signal } from '@angular/core';
import { MemberService } from '../services/member';
import { GroupService } from '../../groups/services/group';


@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  
  classroomId = input.required<number>();

  
  miembros = signal<any[]>([]);
  grupos = signal<any[]>([]);
  cargando = signal(true);
  mensajeError = signal('');

  
  usuario = signal<any>(JSON.parse(localStorage.getItem('gruplab_usuario') || '{}'));

  
  esProfesor = computed(() => this.usuario().rol === 'profesor');

  constructor(
    private memberService: MemberService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.cargarMiembros();
    this.cargarGrupos();
  }

  cargarMiembros() {
    this.memberService.obtenerMiembrosPorAula(this.classroomId()).subscribe({
      next: (data: any) => {
        this.miembros.set(data);
        this.cargando.set(false);
      },
      error: (error: any) => {
        this.mensajeError.set(error.error?.error || 'No se pudieron cargar los miembros');
        this.cargando.set(false);
      }
    });
  }

  cargarGrupos() {
    this.groupService.obtenerGrupos(this.classroomId()).subscribe({
      next: (data: any) => this.grupos.set(data),
      error: (error: any) => console.error('Error al obtener grupos', error)
    });
  }

  
  asignarGrupo(miembro: any, event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    const groupId = valor === '' ? null : Number(valor);

    this.mensajeError.set('');
    this.memberService.asignarGrupo(miembro.id, groupId).subscribe({
      next: () => this.cargarMiembros(),
      error: (error: any) => {
        this.mensajeError.set(error.error?.error || 'No se pudo asignar el grupo');
        
        this.cargarMiembros();
      }
    });
  }

  eliminarMiembro(miembro: any) {
    if (!confirm(`Estas seguro de que deseas eliminar a ${miembro.nombre} del aula?`)) return;

    this.mensajeError.set('');
    this.memberService.eliminarMiembro(miembro.id).subscribe({
      next: () => this.cargarMiembros(),
      error: (error: any) => this.mensajeError.set(error.error?.error || 'No se pudo eliminar el miembro')
    });
  }
}
