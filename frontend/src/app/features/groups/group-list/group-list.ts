import { Component, computed, signal, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { GroupService } from '../services/group';
import { Group } from '../models/group';
import { ClassroomService } from '../../classrooms/services/classroom';
import { MemberService } from '../../members/services/member';
import { Member } from '../../members/models/member';

@Component({
  selector: 'app-group-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './group-list.html'
})
export class GroupList {
  private readonly _groupService = inject(GroupService);
  private readonly _classroomService = inject(ClassroomService);
  private readonly _memberService = inject(MemberService);
  private readonly _formBuilder = inject(FormBuilder);

  readonly classroomId = input.required<number>();
  readonly gruposActualizados = output<void>();

  protected readonly grupos = signal<Group[]>([]);
  protected readonly cargando = signal(false);
  protected readonly errorMsg = signal('');

  protected readonly usuario = signal(this._classroomService.obtenerSesion());
  protected readonly esProfesor = computed(() => this.usuario()?.rol === 'profesor');
  protected readonly miembroActual = signal<Member | null>(null);
  protected readonly miGrupoId = computed(() => this.miembroActual()?.group_id ?? null);

  protected readonly editandoId = signal<number | null>(null);

  protected readonly formulario = this._formBuilder.nonNullable.group({
    nombreProyecto: ['', [Validators.required, Validators.maxLength(100)]]
  });

  protected readonly nombreEdicion = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(100)]
  });

  ngOnInit(): void {
    this.cargarGrupos();
    if (!this.esProfesor()) {
      this.cargarMiembroActual();
    }
  }

  protected cargarMiembroActual(): void {
    const sesion = this.usuario();
    if (!sesion) return;

    this._memberService.obtenerMiembrosPorAula(this.classroomId()).subscribe({
      next: (miembros: Member[]) => {
        const encontrado = miembros.find((m) =>
          sesion.memberId ? m.id === sesion.memberId : (m.nombre === sesion.nombre && m.rol === 'alumno')
        ) ?? null;
        this.miembroActual.set(encontrado);
      },
      error: () => {
        this.miembroActual.set(null);
      }
    });
  }

  protected unirseAGrupo(groupId: number): void {
    const miembro = this.miembroActual();
    if (!miembro) {
      this.errorMsg.set('No se encontro tu registro de alumno en el aula.');
      return;
    }

    this._memberService.asignarGrupo(miembro.id, groupId).subscribe({
      next: () => {
        this.errorMsg.set('');
        this.cargarMiembroActual();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.error ?? 'No se pudo unir al grupo.');
      }
    });
  }

  protected salirDelGrupo(): void {
    const miembro = this.miembroActual();
    if (!miembro) return;

    if (confirm('Estas seguro de que deseas salir de tu grupo?')) {
      this._memberService.asignarGrupo(miembro.id, null).subscribe({
        next: () => {
          this.errorMsg.set('');
          this.cargarMiembroActual();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg.set(err.error?.error ?? 'No se pudo salir del grupo.');
        }
      });
    }
  }

  protected cargarGrupos(): void {
    this.cargando.set(true);
    this._groupService.obtenerGrupos(this.classroomId()).subscribe({
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
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { nombreProyecto } = this.formulario.getRawValue();
    this._groupService.crearGrupo(this.classroomId(), nombreProyecto).subscribe({
      next: () => {
        this.errorMsg.set('');
        this.formulario.reset();
        this.cargarGrupos();
        this.gruposActualizados.emit();
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
    this._groupService.actualizarGrupo(id, this.nombreEdicion.value).subscribe({
      next: () => {
        this.errorMsg.set('');
        this.editandoId.set(null);
        this.cargarGrupos();
        this.gruposActualizados.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(err.error?.error ?? 'No se pudo actualizar el grupo.');
      }
    });
  }

  protected eliminar(grupo: Group): void {
    if (confirm(`Estas seguro de que deseas eliminar el Grupo ${grupo.group_number}?`)) {
      this._groupService.eliminarGrupo(grupo.id).subscribe({
        next: () => {
          this.errorMsg.set('');
          this.cargarGrupos();
          this.gruposActualizados.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg.set(err.error?.error ?? 'No se pudo eliminar el grupo.');
        }
      });
    }
  }
}
