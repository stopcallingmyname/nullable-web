import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { profileKeys } from '../profile.keys';
import { ProfileService } from 'src/app/profile/services/profile.service';

export const injectAllProfilesQuery = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectAllProfilesQuery, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);

    return injectQuery(() => ({
      queryKey: profileKeys.allProfiles,
      queryFn: () => lastValueFrom(profileService.getAllProfiles()),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
