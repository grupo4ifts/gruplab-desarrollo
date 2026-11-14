import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { MemberService } from '../services/member';
import { GrupoDelAula, Member } from '../models/member';
import { GroupService } from '../../groups/services/group';
import { ClassroomService } from '../../classrooms/services/classroom';
import { UsuarioSession } from '../../classrooms/models/classroom';


@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private memberService = inject(MemberService);
  private groupService = inject(GroupService);
  private classroomService = inject(ClassroomService);

  
  classroomId = input.required<number>();

 
  miembros = signal<Member[]>([]);
  grupos = signal<GrupoDelAula[]>([]);
  cargando = signal(true);
  mensajeError = signal('');

  
  usuario = signal<UsuarioSession | null>(this.classroomService.obtenerSesion());

  
  esProfesor = computed(() => this.usuario()?.rol === 'profesor');

  ngOnInit(): void {
    this.cargarMiembros();
    this.cargarGrupos();
  }

  
  cargarMiembros(): void {
    this.memberService.obtenerMiembrosPorAula(this.classroomId()).subscribe({
      next: (miembros: Member[]) => {
        this.miembros.set(miembros);
        this.cargando.set(false);
      },
      error: (err: any) => {
        this.mensajeError.set(err.error?.error || 'No se pudieron cargar los miembros');
        this.cargando.set(false);
      }
    });
  }

  

  cargarGrupos(): void {
    this.groupService.obtenerGrupos(this.classroomId()).subscribe({
      next: (grupos) => this.grupos.set(grupos as GrupoDelAula[]),
      error: (err: any) => console.error('Error al obtener grupos', err)
    });
  }

  

  asignarGrupo(miembro: Member, event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    const groupId = valor === '' ? null : Number(valor);

    this.mensajeError.set('');
    this.memberService.asignarGrupo(miembro.id, groupId).subscribe({
      next: () => this.cargarMiembros(),
      error: (err: any) => {
        this.mensajeError.set(err.error?.error || 'No se pudo asignar el grupo');
        this.cargarMiembros();
      }
    });
  }

  

  eliminarMiembro(miembro: Member): void {
    if (!confirm(`Estas seguro de que deseas eliminar a ${miembro.nombre} del aula?`)) return;

    this.mensajeError.set('');
    this.memberService.eliminarMiembro(miembro.id).subscribe({
      next: () => this.cargarMiembros(),
      error: (err: any) => this.mensajeError.set(err.error?.error || 'No se pudo eliminar el miembro')
    });
  }
}
