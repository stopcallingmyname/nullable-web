import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { userKeys } from '../../../../shared/store/user/user.keys';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';

export const injectLogoutUserMutation = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectLogoutUserMutation, injector);
  return runInInjectionContext(injector, () => {
    const authService: AuthService = inject(AuthService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () => lastValueFrom(authService.logout()),
      retry: false,
      onMutate: () => {
        client.cancelQueries();
      },
      onSuccess: () => {
        client.resetQueries({ queryKey: userKeys.currentUser });
        client.resetQueries({ queryKey: profileKeys.currentProfile });
        client.invalidateQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
