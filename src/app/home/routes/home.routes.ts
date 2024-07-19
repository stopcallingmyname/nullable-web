import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { PROJECT_ROUTES } from 'src/app/project/routes/project.routes';
import { ViewShotsComponent } from '../components/view-shots/view-shots/view-shots.component';
import { authGuard } from 'src/app/auth/guards/auth.guard';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { guestGuard } from 'src/app/auth/guards/guest.guard';
import { ShotsComponent } from 'src/app/project/components/shots/shots/shots.component';
import { ShotsFollowingComponent } from 'src/app/project/components/shots-following/shots-following/shots-following.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ShotsComponent,
        children: [
          {
            path: 'following',
            component: ShotsComponent,
          },
          { path: 'popular', component: ShotsComponent },
          { path: 'new', component: ShotsComponent },
          // { path: '', redirectTo: 'popular', pathMatch: 'full' },
        ],
      },

      {
        path: '',
        loadChildren: () =>
          import('../../profile/routes/profile.routes').then(
            (r) => r.PROFILE_ROUTES
          ),
      },
    ],
    // loadChildren: () =>
    //   import('../../profile/routes/profile.routes').then(
    //     (r) => r.PROFILE_ROUTES
    //   ),
  },
  ...PROJECT_ROUTES,
  { path: '**', component: NotFoundComponent },
];
