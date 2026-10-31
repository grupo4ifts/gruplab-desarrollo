import { Routes } from '@angular/router';
import { Home } from './features/classrooms/home/home';
import { PanelAula } from './features/classrooms/panel-aula/panel-aula';

export const routes: Routes = [
    { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
    { path: 'classrooms', component: Home },
    { path: 'classrooms/:id', component: PanelAula },
    { path: '**', redirectTo: 'classrooms' }
];
