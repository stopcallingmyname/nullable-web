import { Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import { AccountComponent } from '../../account/components/account/account.component';
import { authGuard } from 'src/app/auth/guards/auth.guard';
import { ConfirmDeleteAccountComponent } from '../../account/components/confirm-delete-account/confirm-delete-account.component';
import { AboutComponent } from '../components/about/about/about.component';
import { WorkComponent } from '../components/work/work/work.component';
import { LikedShotsComponent } from '../components/liked-shots/liked-shots/liked-shots.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    loadChildren: () =>
      import('../../account/routes/account.routes').then(
        (r) => r.ACCOUNT_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'account/deletion-confirmation',
    component: ConfirmDeleteAccountComponent,
    canActivate: [authGuard],
  },

  {
    path: ':username',
    component: ProfileComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'work', component: WorkComponent },
      {
        path: 'likes',
        component: LikedShotsComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
