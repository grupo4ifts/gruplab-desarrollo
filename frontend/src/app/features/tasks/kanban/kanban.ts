import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardService } from '../services/board';
import { TaskService } from '../services/task';
import { MemberService } from '../../members/services/member';
import { Member } from '../../members/models/member';
import { BoardColumn, GrupoTablero } from '../models/board-column';
import { Task } from '../models/task';
import { TaskCard } from '../task-card/task-card';
import { Comments } from '../comments/comments';

interface MiembroFiltro {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, TaskCard, Comments],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private memberService = inject(MemberService);
  private fb = inject(FormBuilder);

  readonly colores = [
    { valor: 'secondary', nombre: 'Gris' },
    { valor: 'primary', nombre: 'Azul' },
    { valor: 'info', nombre: 'Celeste' },
    { valor: 'warning', nombre: 'Amarillo' },
    { valor: 'success', nombre: 'Verde' },
    { valor: 'danger', nombre: 'Rojo' },
    { valor: 'dark', nombre: 'Negro' }
  ];

  groupId = signal<number>(0);
  grupo = signal<GrupoTablero | null>(null);
  columnas = signal<BoardColumn[]>([]);
  tareas = signal<Task[]>([]);
  miembrosGrupo = signal<Member[]>([]);
  cargando = signal<boolean>(true);
  mensajeError = signal<string>('');

  filtroMiembro = signal<string>('todos');
  tareaSeleccionada = signal<Task | null>(null);

  mostrarFormTarea = signal<boolean>(false);
  editandoTarea = signal<boolean>(false);
  confirmandoEliminarTarea = signal<boolean>(false);
  errorModalTarea = signal<string>('');

  mostrarFormColumna = signal<boolean>(false);
  mostrarParticipacion = signal<boolean>(false);

  editandoColumnaId = signal<number | null>(null);
  nombreEdicion = signal<string>('');
  colorEdicion = signal<string>('secondary');

  formularioTarea = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    column_id: [0, [Validators.required, Validators.min(1)]],
    assigned_to: [null as number | null]
  });

  formularioEdicionTarea = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    assigned_to: [null as number | null]
  });

  formularioColumna = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    color: ['secondary', [Validators.required]]
  });

  tareaArrastrada = signal<Task | null>(null);
  columnaSobreId = signal<number | null>(null);

  columnasOrdenadas = computed(() =>
    [...this.columnas()].sort((a, b) => a.position - b.position)
  );

  miembrosFiltro = computed<MiembroFiltro[]>(() => {
    const mapa = new Map<number, string>();
    for (const m of this.miembrosGrupo()) {
      mapa.set(m.id, m.nombre);
    }
    for (const t of this.tareas()) {
      if (t.assigned_to !== null && !mapa.has(t.assigned_to)) {
        mapa.set(t.assigned_to, t.assigned_name || `Miembro ${t.assigned_to}`);
      }
    }
    return [...mapa.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  participacionMiembros = computed(() => {
    const listaTareas = this.tareas();
    const totalTareas = listaTareas.length;
    const ordenadas = this.columnasOrdenadas();
    const ultimaColumnaId = ordenadas[ordenadas.length - 1]?.id;

    return this.miembrosGrupo().map(m => {
      const propias = listaTareas.filter(t => t.assigned_to === m.id);
      const terminadas = ultimaColumnaId
        ? propias.filter(t => t.column_id === ultimaColumnaId).length
        : 0;
      const porcentaje = totalTareas > 0 ? Math.round((propias.length / totalTareas) * 100) : 0;

      return {
        id: m.id,
        nombre: m.nombre,
        asignadas: propias.length,
        terminadas,
        porcentaje
      };
    });
  });

  tareasSinAsignar = computed(() =>
    this.tareas().filter(t => t.assigned_to === null).length
  );

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const groupId = Number(params['groupId']);
      this.groupId.set(groupId);
      this.cargarGrupo(groupId);
      this.cargarMiembros(groupId);
      this.cargarTablero();
    });
  }

  cargarMiembros(groupId: number): void {
    this.memberService.obtenerMiembrosPorGrupo(groupId).subscribe({
      next: (miembros) => this.miembrosGrupo.set(miembros),
      error: () => this.miembrosGrupo.set([])
    });
  }

  cargarGrupo(groupId: number): void {
    this.boardService.obtenerGrupo(groupId).subscribe({
      next: (grupo: GrupoTablero) => this.grupo.set(grupo),
      error: () => this.grupo.set(null)
    });
  }

  cargarTablero(): void {
    this.cargando.set(true);
    this.boardService.obtenerTablero(this.groupId()).subscribe({
      next: ({ columns, tasks }) => {
        this.columnas.set(columns);
        this.tareas.set(tasks);
        this.cargando.set(false);
        const seleccionada = this.tareaSeleccionada();
        if (seleccionada) {
          this.tareaSeleccionada.set(tasks.find(t => t.id === seleccionada.id) || null);
        }
      },
      error: (error: any) => {
        this.cargando.set(false);
        this.mostrarError(error, 'No se pudo cargar el tablero');
      }
    });
  }

  obtenerTareasDeColumna(columnId: number): Task[] {
    const filtro = this.filtroMiembro();
    return this.tareas().filter(t => {
      if (t.column_id !== columnId) return false;
      if (filtro === 'todos') return true;
      if (filtro === 'sin') return t.assigned_to === null;
      return t.assigned_to === Number(filtro);
    });
  }

  alternarFormTarea(): void {
    this.mostrarFormTarea.update(v => !v);
    this.formularioTarea.reset({
      title: '',
      description: '',
      column_id: this.columnasOrdenadas()[0]?.id || 0,
      assigned_to: null
    });
  }

  crearTarea(): void {
    if (this.formularioTarea.invalid) {
      this.formularioTarea.markAllAsTouched();
      return;
    }

    const { title, description, column_id, assigned_to } = this.formularioTarea.getRawValue();
    const titulo = (title || '').trim();
    if (!titulo) {
      this.formularioTarea.controls.title.setErrors({ required: true });
      this.formularioTarea.markAllAsTouched();
      return;
    }

    this.taskService.crearTarea({
      group_id: this.groupId(),
      column_id: Number(column_id),
      assigned_to: assigned_to ? Number(assigned_to) : null,
      title: titulo,
      description: (description || '').trim() || null
    }).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.alternarFormTarea();
        this.cargarTablero();
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo crear la tarea')
    });
  }

  abrirDetalleTarea(tarea: Task): void {
    this.tareaSeleccionada.set(tarea);
    this.editandoTarea.set(false);
    this.confirmandoEliminarTarea.set(false);
    this.errorModalTarea.set('');
  }

  cerrarDetalleTarea(): void {
    this.tareaSeleccionada.set(null);
    this.editandoTarea.set(false);
    this.confirmandoEliminarTarea.set(false);
    this.errorModalTarea.set('');
  }

  iniciarEdicionTarea(tarea: Task): void {
    this.editandoTarea.set(true);
    this.confirmandoEliminarTarea.set(false);
    this.errorModalTarea.set('');
    this.formularioEdicionTarea.reset({
      title: tarea.title,
      description: tarea.description || '',
      assigned_to: tarea.assigned_to
    });
  }

  cancelarEdicionTarea(): void {
    this.editandoTarea.set(false);
    this.errorModalTarea.set('');
  }

  guardarEdicionTarea(tarea: Task): void {
    if (this.formularioEdicionTarea.invalid) {
      this.formularioEdicionTarea.markAllAsTouched();
      return;
    }

    const { title, description, assigned_to } = this.formularioEdicionTarea.getRawValue();
    const titulo = (title || '').trim();
    if (!titulo) {
      this.formularioEdicionTarea.controls.title.setErrors({ required: true });
      this.formularioEdicionTarea.markAllAsTouched();
      return;
    }

    this.taskService.actualizarTarea(tarea.id, {
      title: titulo,
      description: (description || '').trim() || null,
      assigned_to: assigned_to ? Number(assigned_to) : null
    }).subscribe({
      next: () => {
        this.editandoTarea.set(false);
        this.errorModalTarea.set('');
        this.cargarTablero();
      },
      error: (error: any) => {
        this.errorModalTarea.set(error?.error?.error || 'No se pudo actualizar la tarea');
      }
    });
  }

  eliminarTarea(tarea: Task): void {
    this.taskService.eliminarTarea(tarea.id).subscribe({
      next: () => {
        this.cerrarDetalleTarea();
        this.cargarTablero();
      },
      error: (error: any) => {
        this.errorModalTarea.set(error?.error?.error || 'No se pudo eliminar la tarea');
      }
    });
  }

  alternarFormColumna(): void {
    this.mostrarFormColumna.update(v => !v);
    this.formularioColumna.reset({ name: '', color: 'secondary' });
  }

  crearColumna(): void {
    if (this.formularioColumna.invalid) {
      this.formularioColumna.markAllAsTouched();
      return;
    }

    const { name, color } = this.formularioColumna.getRawValue();
    const nombre = name.trim();
    if (!nombre) {
      this.formularioColumna.controls.name.setErrors({ required: true });
      this.formularioColumna.markAllAsTouched();
      return;
    }

    this.boardService.crearColumna(this.groupId(), nombre, color).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.alternarFormColumna();
        this.cargarTablero();
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo crear la columna')
    });
  }

  iniciarEdicion(columna: BoardColumn): void {
    this.editandoColumnaId.set(columna.id);
    this.nombreEdicion.set(columna.name);
    this.colorEdicion.set(columna.color);
  }

  cancelarEdicion(): void {
    this.editandoColumnaId.set(null);
  }

  guardarEdicion(columna: BoardColumn): void {
    const nombre = this.nombreEdicion().trim();
    if (!nombre) {
      this.mensajeError.set('El nombre de la columna es obligatorio');
      return;
    }
    if (nombre.length > 50) {
      this.mensajeError.set('El nombre de la columna no puede superar los 50 caracteres');
      return;
    }

    this.boardService.actualizarColumna(columna.id, nombre, this.colorEdicion()).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.editandoColumnaId.set(null);
        this.cargarTablero();
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo actualizar la columna')
    });
  }

  eliminarColumna(columna: BoardColumn): void {
    const cantidad = this.tareas().filter(t => t.column_id === columna.id).length;
    const aviso = cantidad > 0
      ? `La columna "${columna.name}" tiene ${cantidad} tarea(s) que tambien se eliminaran. Deseas continuar?`
      : `Estas seguro de que deseas eliminar la columna "${columna.name}"?`;

    if (!confirm(aviso)) return;

    this.boardService.eliminarColumna(columna.id).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.cargarTablero();
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo eliminar la columna')
    });
  }

  puedeRetroceder(columnId: number): boolean {
    return this.columnasOrdenadas().findIndex(c => c.id === columnId) > 0;
  }

  puedeAvanzar(columnId: number): boolean {
    const lista = this.columnasOrdenadas();
    const indice = lista.findIndex(c => c.id === columnId);
    return indice >= 0 && indice < lista.length - 1;
  }

  moverTarea(tarea: Task, direccion: 'anterior' | 'siguiente'): void {
    const lista = this.columnasOrdenadas();
    const indice = lista.findIndex(c => c.id === tarea.column_id);
    const destino = lista[direccion === 'anterior' ? indice - 1 : indice + 1];
    if (!destino) return;

    this.boardService.moverTareaDeColumna(tarea.id, destino.id).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.tareas.update(lista => lista.map(t =>
          t.id === tarea.id ? { ...t, column_id: destino.id, column_name: destino.name } : t
        ));
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo mover la tarea')
    });
  }

  nombreColumna(columnId: number): string {
    return this.columnas().find(c => c.id === columnId)?.name || '';
  }

  private mostrarError(error: any, porDefecto: string): void {
    this.mensajeError.set(error?.error?.error || porDefecto);
  }

  iniciarArrastre(tarea: Task): void {
    this.tareaArrastrada.set(tarea);
  }
  permitirSoltar(evento: DragEvent, columnId: number): void {
    evento.preventDefault();
    this.columnaSobreId.set(columnId);
  }
  soltarTarea(evento: DragEvent, columnaDestino: BoardColumn): void {
    evento.preventDefault();
    const tarea = this.tareaArrastrada();
    this.tareaArrastrada.set(null);
    this.columnaSobreId.set(null);
    if (!tarea || tarea.column_id === columnaDestino.id) return;
    this.boardService.moverTareaDeColumna(tarea.id, columnaDestino.id).subscribe({
      next: () => {
        this.mensajeError.set('');
        this.tareas.update(lista => lista.map(t =>
          t.id === tarea.id
            ? { ...t, column_id: columnaDestino.id, column_name: columnaDestino.name }
            : t
        ));
      },
      error: (error: any) => this.mostrarError(error, 'No se pudo mover la tarea')
    });
  }
}
