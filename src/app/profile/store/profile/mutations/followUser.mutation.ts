import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';
import { SubscriptionService } from 'src/app/profile/services/subscription.service';
import { SubscriptionInterface } from 'src/app/profile/types/follow.interface';

export const injectFollowUserMutation = (
  { injector }: { injector?: Injector } = {},
  props: { newData: SubscriptionInterface }
) => {
  injector = assertInjectorFn(injectFollowUserMutation, injector);
  return runInInjectionContext(injector, () => {
    const subscriptionService: SubscriptionService =
      inject(SubscriptionService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(subscriptionService.follow(props.newData)),
      retry: false,
      onSuccess: (data: SubscriptionInterface) => {
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({
          queryKey: profileKeys.byUid(data.followee_id),
        });
        client.refetchQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
