import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'carteira', pathMatch: 'full' },
  {
    path: 'carteira',
    loadChildren: () => import('./features/carteira/carteira.routes').then((m) => m.PORTFOLIO_ROUTES),
  },
  {
    path: 'titulos',
    loadChildren: () => import('./features/titulos/titulos.routes').then((m) => m.ASSETS_ROUTES),
  },
  {
    path: 'aportes',
    loadChildren: () => import('./features/aportes/aportes.routes').then((m) => m.POSITIONS_ROUTES),
  },
  {
    path: 'posicoes',
    loadChildren: () => import('./features/projecao/projecao.routes').then((m) => m.PROJECTION_ROUTES),
  },
  {
    path: 'indexadores',
    loadChildren: () => import('./features/indexadores/indexadores.routes').then((m) => m.INDEXES_ROUTES),
  },
];
