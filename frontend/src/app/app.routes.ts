import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
  { 
    path: 'classrooms', 
    loadComponent: () => import('./features/classrooms/home/home').then(m => m.Home) 
  },
  { 
    path: 'classrooms/:id', 
    loadComponent: () => import('./features/classrooms/panel-aula/panel-aula').then(m => m.PanelAula) 
  },
  { path: '**', redirectTo: 'classrooms' }
];