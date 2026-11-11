import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassroomService } from '../services/classroom';
import { Profesor } from '../profesor/profesor';
import { Alumno } from '../alumno/alumno';

export interface MiAulaGuardada {
  id: number;
  name: string;
  duenio: string;
  join_code: string;
  rol: 'profesor' | 'alumno';
  miNombre: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Profesor, Alumno],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  vistaActual = signal<'inicio' | 'profesor' | 'alumno'>('inicio');
  misAulas = signal<MiAulaGuardada[]>([]);

  constructor(
    private classroomService: ClassroomService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarMisAulas();
  }

  cargarMisAulas() {
    const raw = localStorage.getItem('gruplab_mis_aulas');
    if (raw) {
      try {
        this.misAulas.set(JSON.parse(raw));
      } catch {
        this.misAulas.set([]);
      }
    }
  }

  ingresar(aula: MiAulaGuardada) {
    localStorage.setItem('gruplab_usuario', JSON.stringify({
      nombre: aula.miNombre,
      rol: aula.rol,
      classroomId: aula.id
    }));
    this.router.navigate(['/classrooms', aula.id]);
  }
}
