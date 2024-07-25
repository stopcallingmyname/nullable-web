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
import { CredentialResponse } from 'google-one-tap';
import { SocialAuthService } from 'src/app/auth/services/socialAuth.service';

export const injectSocialAuthMutation = (
  { injector }: { injector?: Injector } = {},
  props: { response: CredentialResponse }
) => {
  injector = assertInjectorFn(injectSocialAuthMutation, injector);
  return runInInjectionContext(injector, () => {
    const socialAuthService: SocialAuthService = inject(SocialAuthService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(socialAuthService.authorizeWithGoogle(props.response)),
      retry: false,
      onSuccess: () => {
        client.refetchQueries({ queryKey: userKeys.currentUser });
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.invalidateQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
