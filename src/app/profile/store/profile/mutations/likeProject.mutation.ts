import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { profileKeys } from 'src/app/shared/store/profile/profile.keys';
import { SubscriptionService } from 'src/app/profile/services/subscription.service';
import { SubscriptionInterface } from 'src/app/profile/types/follow.interface';
import { assertInjectorFn } from 'src/app/shared/store/assertInjectorFn';
import { LikeService } from 'src/app/profile/services/like.service';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { projectKeys } from 'src/app/project/store/project/project.keys';

export const injectLikeProjectMutation = (
  { injector }: { injector?: Injector } = {},
  props: { projectId: string }
) => {
  injector = assertInjectorFn(injectLikeProjectMutation, injector);
  return runInInjectionContext(injector, () => {
    const likeService: LikeService = inject(LikeService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () => lastValueFrom(likeService.like(props.projectId)),
      retry: false,
      onSuccess: (data: ProjectInterface) => {
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({ queryKey: ['projects'] });
        client.refetchQueries({ queryKey: ['liked'] });
        client.refetchQueries({ queryKey: ['projects-found-by'] });
      },
    }));
  });
};
