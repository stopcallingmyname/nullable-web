import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { projectKeys } from '../project.keys';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';
import { ProjectService } from 'src/app/project/services/project.service';
import { SearchProjectRequestInterface } from 'src/app/project/types/searchProjectsRequest.interface';

export const injectSearchProjectsQuery = (
  params: { dto: SearchProjectRequestInterface },
  { injector }: { injector?: Injector } = {}
) => {
  injector = assertInjectorFn(injectSearchProjectsQuery, injector);

  return runInInjectionContext(injector, () => {
    const projectService: ProjectService = inject(ProjectService);

    return injectQuery(() => ({
      queryKey: projectKeys.foundBy(params.dto),
      queryFn: () => lastValueFrom(projectService.search(params.dto)),
      placeholderData: keepPreviousData,
      staleTime: 7 * 60 * 1000,
      retry: 2,
    }));
  });
};
