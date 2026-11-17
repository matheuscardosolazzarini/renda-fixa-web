import { Routes } from '@angular/router';
import { PositionCreatePage } from './pages/position-create-page';
import { PositionsPage } from './pages/positions-page';

export const POSITIONS_ROUTES: Routes = [
  { path: '', component: PositionsPage, title: 'Aportes — Renda Fixa' },
  { path: 'novo', component: PositionCreatePage, title: 'Novo aporte — Renda Fixa' },
];
