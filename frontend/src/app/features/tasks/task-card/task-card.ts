import { Component, input, output } from '@angular/core';
import { Task } from '../models/task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})
export class TaskCard {
  tarea = input.required<Task>();
  puedeRetroceder = input<boolean>(true);
  puedeAvanzar = input<boolean>(true);

  mover = output<'anterior' | 'siguiente'>();
  seleccionar = output<Task>();

  moverA(direccion: 'anterior' | 'siguiente', evento: Event): void {
    evento.stopPropagation();
    this.mover.emit(direccion);
  }
}
