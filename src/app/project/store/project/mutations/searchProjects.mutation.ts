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
import { SearchProjectRequestInterface } from 'src/app/project/types/searchProjectsRequest.interface';
import { ProjectService } from 'src/app/project/services/project.service';

export const injectSearchProjectsMutation = (
  { injector }: { injector?: Injector } = {},
  props: { dto: SearchProjectRequestInterface }
) => {
  injector = assertInjectorFn(injectSearchProjectsMutation, injector);
  return runInInjectionContext(injector, () => {
    const projectService: ProjectService = inject(ProjectService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () => lastValueFrom(projectService.search(props.dto)),
      retry: false,
      onSuccess: () => {
        // setCookie('access_token', data.access_token);
        // client.refetchQueries({ queryKey: userKeys.currentUser });
        // client.refetchQueries({ queryKey: profileKeys.currentProfile });
        // client.invalidateQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
