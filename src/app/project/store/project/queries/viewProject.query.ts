import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';
import { projectKeys } from '../project.keys';
import { ProjectService } from 'src/app/project/services/project.service';

export const injectViewProjectQuery = (
  params: { pid?: string },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectViewProjectQuery, injector);
  return runInInjectionContext(injector, () => {
    const projectService: ProjectService = inject(ProjectService);

    return injectQuery(() => ({
      queryKey: projectKeys.byPid(params.pid || ''),
      queryFn: () =>
        lastValueFrom(projectService.viewProject(params.pid || '')),
      retry: 2,
      staleTime: 7 * 60 * 1000,
    }));
  });
};
