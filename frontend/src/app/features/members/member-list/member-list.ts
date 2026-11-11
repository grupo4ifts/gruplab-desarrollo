import { Component, input, signal, OnInit } from '@angular/core';
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
  errorMsg = signal('');

  constructor(
    private memberService: MemberService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.memberService.obtenerMiembros(this.classroomId()).subscribe({
      next: (data: any) => this.miembros.set(data),
      error: (err: any) => this.errorMsg.set('Error al cargar miembros')
    });

    this.groupService.obtenerGrupos(this.classroomId()).subscribe({
      next: (data: any) => this.grupos.set(data),
      error: () => {}
    });
  }

  asignar(memberId: number, selectElem: HTMLSelectElement) {
    const rawVal = selectElem.value;
    const groupId = rawVal === '' ? null : Number(rawVal);

    this.memberService.asignarGrupo(memberId, groupId).subscribe({
      next: () => this.cargarDatos(),
      error: (err: any) => alert(err.error?.error || 'Error al asignar grupo')
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este miembro?')) return;
    this.memberService.eliminarMiembro(id).subscribe({
      next: () => this.cargarDatos(),
      error: (err: any) => alert(err.error?.error || 'Error al eliminar miembro')
    });
  }
}

