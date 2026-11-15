import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../models/comment';
import { CommentService } from '../services/comment.service';
import { ClassroomService } from '../../classrooms/services/classroom';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})

export class Comments implements OnInit {

  private commentService = inject(CommentService);
  private classroomService = inject(ClassroomService);

  tareaID = input.required<number>();

  comentarios = signal<Comment[]>([]);
  contenido = signal('');
  comentarioEditando = signal<number | null>(null);
  contenidoEdicion = signal('');

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.commentService.obtenerComentarios(this.tareaID()).subscribe({
      next: (respuesta) => {
        this.comentarios.set(respuesta);
      },
        error: (error) => {
    alert(error.error?.mensaje || 'Error: No se pudo cargar los comentarios');
  }
    });
  }

  crearComentario(): void {
    const sesion = this.classroomService.obtenerSesion();
    const texto = this.contenido().trim();
    
    if (!texto || !sesion?.nombre) return;
    this.commentService.crearComentario(
      this.tareaID(),
      sesion.nombre,
      texto
    ).subscribe({
      next: () => {
        this.contenido.set('');
        this.cargarComentarios();
      },
      error: (error) => {
        alert(error.error?.mensaje || 'Error: No se pudo crear su comentario');
      }
    });
  }

  iniciarEdicion(comentario: Comment): void {
    this.comentarioEditando.set(comentario.id);
    this.contenidoEdicion.set(comentario.content);
  }

  guardarEdicion(comentario: Comment): void {
    const sesion = this.classroomService.obtenerSesion();
    const texto = this.contenidoEdicion().trim();

    if (!texto || !sesion?.nombre) return;

    this.commentService.editarComentario(
      comentario.id,
      sesion.nombre,
      texto
    ).subscribe({
      next: () => {
        this.comentarioEditando.set(null);
        this.contenidoEdicion.set('');
        this.cargarComentarios();
       },
      error: (error) => {
        alert(error.error?.mensaje || 'Error: Su comentario no se pudo editar, Intente nuevamente.');
      }
    });
  }

  eliminarComentario(comentario: Comment): void {
    const sesion = this.classroomService.obtenerSesion();
    if (!sesion?.nombre) return;
    if (!confirm('¿Querés eliminar este comentario?')) return;

    this.commentService.eliminarComentario(
      comentario.id,
      sesion.nombre
    ).subscribe({
      next: () => {
        this.cargarComentarios();
       },
      error: (error) => {
        alert(error.error?.mensaje || 'Error: Su comentario no se pudo eliminar, Intente nuevamente');
      }
    });
  }

  esAutor(comentario:Comment):boolean{
    const sesion =this.classroomService.obtenerSesion();
    return sesion?.nombre === comentario.author_name;
  }

  cancelarEdicion(): void {
    this.comentarioEditando.set(null);
    this.contenidoEdicion.set('');
  }
}