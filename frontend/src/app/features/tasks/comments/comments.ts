import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../models/comment';
import { CommentService } from '../services/comment';
import { ClassroomService } from '../../classrooms/services/classroom';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comments.html'
})
export class Comments implements OnInit {
  private commentService = inject(CommentService);
  private classroomService = inject(ClassroomService);
  private fb = inject(FormBuilder);

  tareaID = input.required<number>();

  comentarios = signal<Comment[]>([]);
  comentarioEditando = signal<number | null>(null);
  comentarioAEliminar = signal<number | null>(null);
  errorMsg = signal('');

  formularioComentario = this.fb.nonNullable.group({
    contenido: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  formularioEdicion = this.fb.nonNullable.group({
    contenido: ['', [Validators.required, Validators.maxLength(1000)]]
  });

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
    if (this.formularioComentario.invalid) {
      this.formularioComentario.markAllAsTouched();
      return;
    }

    const sesion = this.classroomService.obtenerSesion();
    if (!sesion?.nombre) {
      this.errorMsg.set('Debes iniciar sesion para comentar.');
      return;
    }

    const texto = this.formularioComentario.getRawValue().contenido.trim();
    if (!texto) {
      this.formularioComentario.controls.contenido.setErrors({ required: true });
      this.formularioComentario.markAllAsTouched();
      return;
    }

    this.errorMsg.set('');
    this.commentService.crearComentario(this.tareaID(), sesion.nombre, texto).subscribe({
      next: () => {
        this.formularioComentario.reset({ contenido: '' });
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
    this.formularioEdicion.reset({ contenido: comentario.content });
  }

  guardarEdicion(comentario: Comment): void {
    if (this.formularioEdicion.invalid) {
      this.formularioEdicion.markAllAsTouched();
      return;
    }

    const sesion = this.classroomService.obtenerSesion();
    if (!sesion?.nombre) return;

    const texto = this.formularioEdicion.getRawValue().contenido.trim();
    if (!texto) {
      this.formularioEdicion.controls.contenido.setErrors({ required: true });
      this.formularioEdicion.markAllAsTouched();
      return;
    }

    this.errorMsg.set('');
    this.commentService.editarComentario(comentario.id, sesion.nombre, texto).subscribe({
      next: () => {
        this.comentarioEditando.set(null);
        this.formularioEdicion.reset({ contenido: '' });
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
    this.formularioEdicion.reset({ contenido: '' });
  }
}