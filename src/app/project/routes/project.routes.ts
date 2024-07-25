import { Routes } from '@angular/router';

import { authGuard } from 'src/app/auth/guards/auth.guard';
import { ProjectComponent } from '../components/project/project/project.component';
import { NewProjectComponent } from '../components/new-project/new-project/new-project.component';
import { ShotsComponent } from '../components/shots/shots/shots.component';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'shots/:id',
    component: ProjectComponent,
  },
  {
    path: 'uploads/new',
    component: NewProjectComponent,
    canActivate: [authGuard],
  },
];
