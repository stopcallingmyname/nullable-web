import { inject, Injector, runInInjectionContext } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import { AuthService } from 'src/app/auth/services/auth.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { userKeys } from '../user.keys';
import { lastValueFrom } from 'rxjs';

export const injectCurrentUserQuery = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectCurrentUserQuery, injector);
  return runInInjectionContext(injector, () => {
    const authService: AuthService = inject(AuthService);

    return injectQuery(() => ({
      queryKey: userKeys.currentUser,
      queryFn: () => lastValueFrom(authService.getUser()),
      staleTime: 7 * 60 * 1000,
      refetchOnMount: false,
      retry: false,
    }));
  });
};
