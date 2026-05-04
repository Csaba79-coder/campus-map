import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';
import { guestGuard } from './auth/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home').then((m) => m.Home),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
