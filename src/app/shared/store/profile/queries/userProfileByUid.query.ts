import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { profileKeys } from '../profile.keys';
import { ProfileService } from 'src/app/profile/services/profile.service';

export const injectUserProfileByUidQuery = (
  params: { uid?: string },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectUserProfileByUidQuery, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);

    return injectQuery(() => ({
      queryKey: profileKeys.byUid(params.uid || ''),
      queryFn: () =>
        lastValueFrom(profileService.getProfileByUid(params.uid || '')),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
