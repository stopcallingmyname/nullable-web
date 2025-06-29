import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { assertInjectorFn } from '../../assertInjectorFn';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { userKeys } from '../user.keys';
import { UserService } from 'src/app/account/services/user.service';

export const injectUserByProfileIdQuery = (
  params: { profile_id?: string },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectUserByProfileIdQuery, injector);
  return runInInjectionContext(injector, () => {
    const userService: UserService = inject(UserService);

    return injectQuery(() => ({
      queryKey: userKeys.byProfileId(params.profile_id || ''),
      queryFn: () =>
        lastValueFrom(userService.getUserByProfileId(params.profile_id || '')),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
