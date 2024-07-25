import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { userKeys } from '../../../../shared/store/user/user.keys';
import { RegisterRequestInterface } from 'src/app/auth/types/registerRequest.interface';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';

export const injectRegisterUserMutation = (
  { injector }: { injector?: Injector } = {},
  props: { user: RegisterRequestInterface }
) => {
  injector = assertInjectorFn(injectRegisterUserMutation, injector);
  return runInInjectionContext(injector, () => {
    const authService: AuthService = inject(AuthService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () => lastValueFrom(authService.register(props.user)),
      retry: false,
      onSuccess: () => {
        client.refetchQueries({ queryKey: userKeys.currentUser });
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
