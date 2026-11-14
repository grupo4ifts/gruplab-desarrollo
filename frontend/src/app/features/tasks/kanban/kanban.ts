import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BoardService } from '../services/board';
import { BoardColumn, GrupoTablero } from '../models/board-column';
import { Task } from '../models/task';
import { TaskCard } from '../task-card/task-card';

interface MiembroFiltro {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [RouterLink, DatePipe, TaskCard],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);

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
  cargando = signal<boolean>(true);
  mensajeError = signal<string>('');

  filtroMiembro = signal<string>('todos');
  tareaSeleccionada = signal<Task | null>(null);

  mostrarFormColumna = signal<boolean>(false);
  nombreNuevaColumna = signal<string>('');
  colorNuevaColumna = signal<string>('secondary');

  editandoColumnaId = signal<number | null>(null);
  nombreEdicion = signal<string>('');
  colorEdicion = signal<string>('secondary');

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
      this.cargarTablero();
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
}
