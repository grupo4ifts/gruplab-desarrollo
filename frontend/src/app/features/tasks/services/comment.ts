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

    obtenerComentarios(tareaID: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/tasks/${tareaID}/comments`);
    }

    crearComentario(tareaID: number, autorName: string, contenido: string): Observable<{ message: string; id: number }> {
        return this.http.post<{ message: string; id: number }>(`${this.apiUrl}/comments`, { tareaID, autorName, contenido });
    }

    editarComentario(comentarioID: number, autorName: string, contenido: string): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/comments/${comentarioID}`, { autorName, contenido });
    }

    eliminarComentario(comentarioID: number, autorName: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/comments/${comentarioID}`, { body: { autorName } });
    }
}