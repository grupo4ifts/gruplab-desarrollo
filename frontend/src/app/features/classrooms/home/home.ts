import { Component, signal } from '@angular/core';
import { Profesor } from '../profesor/profesor';
import { Alumno } from '../alumno/alumno';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Profesor, Alumno],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  vistaActual = signal<'inicio' | 'profesor' | 'alumno'>('inicio');
}