import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { UpdateProfileRequestInterface } from 'src/app/account/types/updateProfileRequestInterface';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';

export const injectUpdateUserProfileMutation = (
  { injector }: { injector?: Injector } = {},
  props: { newProfileData: UpdateProfileRequestInterface }
) => {
  injector = assertInjectorFn(injectUpdateUserProfileMutation, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(profileService.updateProfile(props.newProfileData)),
      retry: false,
      onSuccess: (data) => {
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({ queryKey: profileKeys.byUid(data.id) });
        client.refetchQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
