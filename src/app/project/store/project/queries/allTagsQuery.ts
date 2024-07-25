import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';
import { tagKeys } from 'src/app/shared/store/profile/tag.keys';

export const injectAllTagsQuery = ({
  injector,
}: { injector?: Injector } = {}) => {
  injector = assertInjectorFn(injectAllTagsQuery, injector);
  return runInInjectionContext(injector, () => {
    const tagService: TagService = inject(TagService);

    return injectQuery(() => ({
      queryKey: tagKeys.allTags,
      queryFn: () => lastValueFrom(tagService.getAllTags()),
      staleTime: 7 * 60 * 1000,
    }));
  });
};
