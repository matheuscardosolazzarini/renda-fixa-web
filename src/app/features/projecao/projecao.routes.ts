import { Routes } from '@angular/router';
import { ProjectionPage } from './pages/projection-page';

export const PROJECTION_ROUTES: Routes = [
  { path: ':id', component: ProjectionPage, title: 'Projeção da posição — Renda Fixa' },
];
