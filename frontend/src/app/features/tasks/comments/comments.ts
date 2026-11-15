import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Comment } from '../models/comment';
import { CommentService } from '../services/comment';
import { ClassroomService } from '../../classrooms/services/classroom';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './comments.html'
})
export class Comments implements OnInit {
  private commentService = inject(CommentService);
  private classroomService = inject(ClassroomService);

  tareaID = input.required<number>();

  comentarios = signal<Comment[]>([]);
  contenido = signal('');
  comentarioEditando = signal<number | null>(null);
  contenidoEdicion = signal('');
  comentarioAEliminar = signal<number | null>(null);
  errorMsg = signal('');

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.commentService.obtenerComentarios(this.tareaID()).subscribe({
      next: (respuesta) => {
        this.comentarios.set(respuesta);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error || 'No se pudieron cargar los comentarios.');
      }
    });
  }

  crearComentario(): void {
    const sesion = this.classroomService.obtenerSesion();
    const texto = this.contenido().trim();

    if (!sesion?.nombre) {
      this.errorMsg.set('Debes iniciar sesion para comentar.');
      return;
    }
    if (!texto) {
      this.errorMsg.set('El comentario no puede estar vacio.');
      return;
    }

    this.errorMsg.set('');
    this.commentService.crearComentario(this.tareaID(), sesion.nombre, texto).subscribe({
      next: () => {
        this.contenido.set('');
        this.cargarComentarios();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error || 'No se pudo publicar el comentario.');
      }
    });
  }

  iniciarEdicion(comentario: Comment): void {
    this.errorMsg.set('');
    this.comentarioAEliminar.set(null);
    this.comentarioEditando.set(comentario.id);
    this.contenidoEdicion.set(comentario.content);
  }

  guardarEdicion(comentario: Comment): void {
    const sesion = this.classroomService.obtenerSesion();
    const texto = this.contenidoEdicion().trim();

    if (!sesion?.nombre) return;
    if (!texto) {
      this.errorMsg.set('El comentario no puede estar vacio.');
      return;
    }

    this.errorMsg.set('');
    this.commentService.editarComentario(comentario.id, sesion.nombre, texto).subscribe({
      next: () => {
        this.comentarioEditando.set(null);
        this.contenidoEdicion.set('');
        this.cargarComentarios();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error || 'No se pudo editar el comentario.');
      }
    });
  }

  confirmarEliminacion(comentarioId: number): void {
    this.errorMsg.set('');
    this.comentarioAEliminar.set(comentarioId);
  }

  cancelarEliminacion(): void {
    this.comentarioAEliminar.set(null);
  }

  eliminarComentario(comentario: Comment): void {
    const sesion = this.classroomService.obtenerSesion();
    if (!sesion?.nombre) return;

    this.errorMsg.set('');
    this.commentService.eliminarComentario(comentario.id, sesion.nombre).subscribe({
      next: () => {
        this.comentarioAEliminar.set(null);
        this.cargarComentarios();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error || 'No se pudo eliminar el comentario.');
      }
    });
  }

  esAutor(comentario: Comment): boolean {
    const sesion = this.classroomService.obtenerSesion();
    return sesion?.nombre === comentario.author_name;
  }

  cancelarEdicion(): void {
    this.comentarioEditando.set(null);
    this.contenidoEdicion.set('');
  }
}