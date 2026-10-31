import { Routes } from '@angular/router';
import { Home } from './features/classrooms/home/home';

export const routes: Routes = [
    { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
    { path: 'classrooms', component: Home },
    { path: '**', redirectTo: 'classrooms' }
];
