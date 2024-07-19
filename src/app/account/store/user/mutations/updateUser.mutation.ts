import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { UserService } from 'src/app/account/services/user.service';
import { UpdateUserRequestInterface } from 'src/app/account/types/updateUserRequest.interface';
import { userKeys } from 'src/app/shared/store/user/user.keys';

export const injectUpdateUserMutation = (
  { injector }: { injector?: Injector } = {},
  props: { newUserData: UpdateUserRequestInterface }
) => {
  injector = assertInjectorFn(injectUpdateUserMutation, injector);
  return runInInjectionContext(injector, () => {
    const userService: UserService = inject(UserService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(userService.updateUser(props.newUserData)),
      retry: false,
      onMutate: () => {
        client.cancelQueries({ queryKey: userKeys.currentUser });
      },
      onSuccess: () => {
        client.refetchQueries({ queryKey: userKeys.currentUser });
      },
    }));
  });
};
