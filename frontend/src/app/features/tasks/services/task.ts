import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

export interface CrearTareaPayload {
  group_id: number;
  column_id: number;
  assigned_to: number | null;
  title: string;
  description: string | null;
}

export interface ActualizarTareaPayload {
  title: string;
  description: string | null;
  assigned_to: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  obtenerTareaPorId(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  crearTarea(data: CrearTareaPayload): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(this.apiUrl, data);
  }

  actualizarTarea(id: number, data: ActualizarTareaPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, data);
  }

  eliminarTarea(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
