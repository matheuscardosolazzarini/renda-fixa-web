import { Routes } from '@angular/router';
import { AssetCreatePage } from './pages/asset-create-page';
import { AssetEditPage } from './pages/asset-edit-page';
import { AssetsPage } from './pages/assets-page';

export const ASSETS_ROUTES: Routes = [
  { path: '', component: AssetsPage, title: 'Títulos — Renda Fixa' },
  { path: 'novo', component: AssetCreatePage, title: 'Novo título — Renda Fixa' },
  { path: ':id', component: AssetEditPage, title: 'Editar título — Renda Fixa' },
];
