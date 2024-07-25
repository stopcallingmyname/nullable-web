import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { projectKeys } from '../project.keys';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';
import { ProjectService } from 'src/app/project/services/project.service';

export const injectUserProjectsByUsernameQuery = (
  params: { username?: string },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectUserProjectsByUsernameQuery, injector);

  return runInInjectionContext(injector, () => {
    const projectService: ProjectService = inject(ProjectService);

    return injectQuery(() => ({
      queryKey: projectKeys.byUsername(params.username || ''),
      queryFn: () =>
        lastValueFrom(projectService.getUserProjects(params.username || '')),
      placeholderData: keepPreviousData,
      staleTime: 7 * 60 * 1000,
      retry: 2,
    }));
  });
};
