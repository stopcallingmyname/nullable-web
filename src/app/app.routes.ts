import { Routes } from '@angular/router';

import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { guestGuard } from './auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'session/new',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'signup/new',
    component: RegisterComponent,
    canActivate: [guestGuard],
  },
  { path: 'session', redirectTo: 'session/new', pathMatch: 'prefix' },
  { path: 'signup', redirectTo: 'signup/new', pathMatch: 'prefix' },
  {
    path: '',
    loadChildren: () =>
      import('./home/routes/home.routes').then((r) => r.HOME_ROUTES),
  },
  { path: '**', component: NotFoundComponent },
];
