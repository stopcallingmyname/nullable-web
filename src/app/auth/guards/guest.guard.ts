import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isAuthorized().pipe(
    map((isAuthorized) => {
      if (isAuthorized) {
        router.navigateByUrl('/');
        return false;
      } else {
        return true;
      }
    })
  );
};
