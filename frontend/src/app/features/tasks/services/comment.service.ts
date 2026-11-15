import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000';

    // Obtener los comentarios de una tarea
    obtenerComentarios(tareaID: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/tasks/${tareaID}/comments`);
    }

    crearComentario(tareaID: number, autorName: string, contenido: string): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/comments`, { tareaID, autorName, contenido });
    }

    editarComentario(comentarioID: number, autorName: string, contenido: string): Observable<number> {
        return this.http.put<number>(`${this.apiUrl}/comments/${comentarioID}`, { autorName, contenido });
    }

    eliminarComentario(comentarioID: number, autorName: string): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/comments/${comentarioID}`, { body: { autorName } });
    }
}