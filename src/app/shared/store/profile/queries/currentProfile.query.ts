import { inject, Injector, runInInjectionContext } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import {
  injectQuery,
  injectQueryClient,
  keepPreviousData,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { profileKeys } from '../profile.keys';
import { ProfileService } from 'src/app/profile/services/profile.service';

export const injectCurrentProfileQuery = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectCurrentProfileQuery, injector);

  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);

    return injectQuery(() => ({
      queryKey: profileKeys.currentProfile,
      queryFn: () => lastValueFrom(profileService.getCurrentProfile()),
      placeholderData: keepPreviousData,
      staleTime: 7 * 60 * 1000,
      retry: 3,
    }));
  });
};
