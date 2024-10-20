import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'geren-csv', loadComponent: () => import('./features/gerenciamento-csv/gerenciamento-csv.component').then(m => m.GerenciamentoCsvComponent) },
];
