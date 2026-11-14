import { Component, signal, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { GroupService } from '../services/group';
import { Group } from '../models/group';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './group-list.html',
  styleUrl: './group-list.css'
})
export class GroupList implements OnInit {
  private groupService = inject(GroupService);

  readonly classroomId = input.required<number>();

  protected readonly grupos = signal<Group[]>([]);
  protected readonly cargando = signal(false);
  protected readonly errorMsg = signal('');

  protected readonly editandoId = signal<number | null>(null);

  protected readonly nombreProyecto = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)]
  });

  protected readonly nombreEdicion = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)]
  });

  ngOnInit(): void {
    this.cargarGrupos();
  }

  protected cargarGrupos(): void {
    this.cargando.set(true);
    this.groupService.obtenerGrupos(this.classroomId()).subscribe({
      next: (grupos: Group[]) => {
        this.grupos.set(grupos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.error ?? 'No se pudieron cargar los grupos.');
        this.cargando.set(false);
      }
    });
  }

  protected crear(): void {
    if (this.nombreProyecto.invalid) return;
    this.groupService.crearGrupo(this.classroomId(), this.nombreProyecto.value).subscribe({
      next: () => {
        this.errorMsg.set('');
        this.nombreProyecto.reset();
        this.cargarGrupos();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.error ?? 'No se pudo crear el grupo.');
      }
    });
  }

  protected editar(grupo: Group): void {
    this.editandoId.set(grupo.id);
    this.nombreEdicion.setValue(grupo.project_name);
  }

  protected cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  protected guardar(id: number): void {
    if (this.nombreEdicion.invalid) return;
    this.groupService.actualizarGrupo(id, this.nombreEdicion.value).subscribe({
      next: () => {
        this.errorMsg.set('');
        this.editandoId.set(null);
        this.cargarGrupos();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.error ?? 'No se pudo actualizar el grupo.');
      }
    });
  }

  protected eliminar(grupo: Group): void {
    if (confirm(`Estas seguro de que deseas eliminar el Grupo ${grupo.group_number}?`)) {
      this.groupService.eliminarGrupo(grupo.id).subscribe({
        next: () => {
          this.errorMsg.set('');
          this.cargarGrupos();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg.set(err.error?.error ?? 'No se pudo eliminar el grupo.');
        }
      });
    }
  }
}
