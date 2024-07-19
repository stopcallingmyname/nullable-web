import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';
import { UpdateUserSkillsRequestInterface } from 'src/app/profile/types/update-user-skills-request.interface..dto';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';

export const injectUpdateUserSkillsMutation = (
  { injector }: { injector?: Injector } = {},
  props: { newSkills: UpdateUserSkillsRequestInterface }
) => {
  injector = assertInjectorFn(injectUpdateUserSkillsMutation, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);
    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(profileService.updateSkills(props.newSkills)),
      retry: false,
      onSuccess: (data: CurrentProfileInterface) => {
        client.refetchQueries({
          queryKey: profileKeys.byUid(data.id),
        });
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
