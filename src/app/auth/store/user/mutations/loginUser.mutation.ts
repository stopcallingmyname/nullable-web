import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { LoginRequestInterface } from 'src/app/auth/types/loginRequest.interface';
import { userKeys } from '../../../../shared/store/user/user.keys';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';

export const injectLoginUserMutation = (
  { injector }: { injector?: Injector } = {},
  props: { user: LoginRequestInterface }
) => {
  injector = assertInjectorFn(injectLoginUserMutation, injector);
  return runInInjectionContext(injector, () => {
    const authService: AuthService = inject(AuthService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () => lastValueFrom(authService.login(props.user)),
      retry: false,
      onSuccess: () => {
        // setCookie('access_token', data.access_token);
        client.refetchQueries({ queryKey: userKeys.currentUser });
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.invalidateQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
