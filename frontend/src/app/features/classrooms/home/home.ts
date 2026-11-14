import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuLab, UsuarioSession } from '../models/classroom';
import { ClassroomService } from '../services/classroom';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  usuario = signal<UsuarioSession | null>(null);

  misAuLabs = signal<AuLab[]>([]);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.misAuLabs.set(this.classroomService.obtenerAuLabs());
    this.usuario.set(this.classroomService.obtenerSesion());
  }

  entrarAAuLab(aulab: AuLab): void {
    this.classroomService.establecerAuLabActivo(aulab);
    this.router.navigate(['/classrooms', aulab.classroomId]);
  }

  quitarAuLab(classroomId: number): void {
    this.classroomService.quitarAuLab(classroomId);
    if (this.usuario()?.classroomId === classroomId) {
      this.classroomService.cerrarSesion();
    }
    this.cargarDatos();
  }
}
