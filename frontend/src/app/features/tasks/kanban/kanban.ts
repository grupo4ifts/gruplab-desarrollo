import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  imports: [RouterLink, DatePipe, TaskCard, Comments],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private memberService = inject(MemberService);

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
  tituloNuevaTarea = signal<string>('');
  descripcionNuevaTarea = signal<string>('');
  columnaNuevaTarea = signal<number>(0);
  asignadoNuevaTarea = signal<number | null>(null);

  editandoTarea = signal<boolean>(false);
  tituloEdicionTarea = signal<string>('');
  descripcionEdicionTarea = signal<string>('');
  asignadoEdicionTarea = signal<number | null>(null);
  confirmandoEliminarTarea = signal<boolean>(false);
  errorModalTarea = signal<string>('');

  mostrarFormColumna = signal<boolean>(false);
  nombreNuevaColumna = signal<string>('');
  colorNuevaColumna = signal<string>('secondary');

  editandoColumnaId = signal<number | null>(null);
  nombreEdicion = signal<string>('');
  colorEdicion = signal<string>('secondary');

  tareaArrastrada = signal<Task | null>(null);
  columnaSobreId = signal<number | null>(null);

  columnasOrdenadas = computed(() =>
    [...this.columnas()].sort((a, b) => a.position - b.position)
  );

  miembrosConTareas = computed<MiembroFiltro[]>(() => {
    const mapa = new Map<number, string>();
    for (const t of this.tareas()) {
      if (t.assigned_to !== null) {
        mapa.set(t.assigned_to, t.assigned_name || `Miembro ${t.assigned_to}`);
      }
    }
    return [...mapa.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

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
    this.tituloNuevaTarea.set('');
    this.descripcionNuevaTarea.set('');
    this.asignadoNuevaTarea.set(null);
    this.columnaNuevaTarea.set(this.columnasOrdenadas()[0]?.id || 0);
  }

  crearTarea(): void {
    const title = this.tituloNuevaTarea().trim();
    const column_id = this.columnaNuevaTarea();
    if (!title) {
      this.mensajeError.set('El titulo de la tarea es obligatorio');
      return;
    }
    if (!column_id) {
      this.mensajeError.set('Selecciona una columna para la tarea');
      return;
    }

    this.taskService.crearTarea({
      group_id: this.groupId(),
      column_id,
      assigned_to: this.asignadoNuevaTarea(),
      title,
      description: this.descripcionNuevaTarea().trim() || null
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
    this.tituloEdicionTarea.set(tarea.title);
    this.descripcionEdicionTarea.set(tarea.description || '');
    this.asignadoEdicionTarea.set(tarea.assigned_to);
  }

  cancelarEdicionTarea(): void {
    this.editandoTarea.set(false);
    this.errorModalTarea.set('');
  }

  guardarEdicionTarea(tarea: Task): void {
    const title = this.tituloEdicionTarea().trim();
    if (!title) {
      this.errorModalTarea.set('El titulo de la tarea es obligatorio');
      return;
    }

    this.taskService.actualizarTarea(tarea.id, {
      title,
      description: this.descripcionEdicionTarea().trim() || null,
      assigned_to: this.asignadoEdicionTarea()
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
    this.nombreNuevaColumna.set('');
    this.colorNuevaColumna.set('secondary');
  }

  crearColumna(): void {
    const nombre = this.nombreNuevaColumna().trim();
    if (!nombre) {
      this.mensajeError.set('El nombre de la columna es obligatorio');
      return;
    }
    if (nombre.length > 50) {
      this.mensajeError.set('El nombre de la columna no puede superar los 50 caracteres');
      return;
    }

    this.boardService.crearColumna(this.groupId(), nombre, this.colorNuevaColumna()).subscribe({
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
