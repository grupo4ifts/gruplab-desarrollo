import { Routes } from '@angular/router';

/**
 * Tabla de enrutamiento principal de la aplicación.
 * Todas las vistas del módulo de aulas utilizan carga perezosa (lazy loading)
 * mediante import() dinámico para optimizar el peso inicial del bundle.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
  { 
    path: 'classrooms', 
    loadComponent: () => import('./features/classrooms/home/home').then(m => m.Home) 
  },
  { 
    path: 'classrooms/nuevo', 
    loadComponent: () => import('./features/classrooms/profesor/profesor').then(m => m.Profesor) 
  },
  { 
    path: 'classrooms/unirse', 
    loadComponent: () => import('./features/classrooms/alumno/alumno').then(m => m.Alumno) 
  },
  { 
    path: 'classrooms/:id', 
    loadComponent: () => import('./features/classrooms/panel-aula/panel-aula').then(m => m.PanelAula) 
  },
  { path: '**', redirectTo: 'classrooms' }
];
