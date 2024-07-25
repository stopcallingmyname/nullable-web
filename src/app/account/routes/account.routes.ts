import { Routes } from '@angular/router';

import { EditProfileComponent } from '../components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { authGuard } from 'src/app/auth/guards/auth.guard';
import { GeneralComponent } from '../components/general/general.component';
import { SocialProfilesComponent } from '../components/social-profiles/social-profiles/social-profiles.component';
import { ConfirmDeleteAccountComponent } from '../components/confirm-delete-account/confirm-delete-account.component';
import { AccountComponent } from '../components/account/account.component';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'general',
    component: GeneralComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'social-profiles',
    component: SocialProfilesComponent,
    canActivate: [authGuard],
  },
];
