import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/app/project/services/project.service';
import { projectKeys } from 'src/app/project/store/project/project.keys';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';

export const injectAllProjectsQuery = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectAllProjectsQuery, injector);
  return runInInjectionContext(injector, () => {
    const projectService: ProjectService = inject(ProjectService);

    return injectQuery(() => ({
      queryKey: projectKeys.allProjects,
      queryFn: () => lastValueFrom(projectService.getAllProjects()),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
