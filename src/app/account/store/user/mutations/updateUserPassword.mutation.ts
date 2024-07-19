import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { UserService } from 'src/app/account/services/user.service';
import { userKeys } from 'src/app/shared/store/user/user.keys';
import { UpdateUserPasswordRequestInterface } from 'src/app/account/types/updateUserPasswordRequest.interface';

export const injectUpdateUserPasswordMutation = (
  { injector }: { injector?: Injector } = {},
  props: { newPasswordData: UpdateUserPasswordRequestInterface }
) => {
  injector = assertInjectorFn(injectUpdateUserPasswordMutation, injector);
  return runInInjectionContext(injector, () => {
    const userService: UserService = inject(UserService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(userService.updateUserPassword(props.newPasswordData)),
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
