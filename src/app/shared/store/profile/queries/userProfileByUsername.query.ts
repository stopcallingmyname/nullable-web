import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { profileKeys } from '../profile.keys';
import { ProfileService } from 'src/app/profile/services/profile.service';

export const injectUserProfileByUsernameQuery = (
  params: { username?: string },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectUserProfileByUsernameQuery, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);

    return injectQuery(() => ({
      queryKey: profileKeys.byUsername(params.username || ''),
      queryFn: () =>
        lastValueFrom(
          profileService.getProfileByUsername(params.username || '')
        ),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
