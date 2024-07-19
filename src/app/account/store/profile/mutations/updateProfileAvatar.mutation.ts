import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { assertInjectorFn } from '../../../../shared/store/assertInjectorFn';
import { ProfileService } from 'src/app/profile/services/profile.service';
import { profileKeys } from 'src/app/shared/store/profile/profile.keys';
import { userKeys } from 'src/app/shared/store/user/user.keys';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { UploadcareService } from 'src/app/account/services/uploadcare.service';

export const injectUpdateProfileAvatarMutation = (
  { injector }: { injector?: Injector } = {},
  props: { image_uuid: string }
) => {
  injector = assertInjectorFn(injectUpdateProfileAvatarMutation, injector);
  return runInInjectionContext(injector, () => {
    const profileService: ProfileService = inject(ProfileService);
    const uploadcareService: UploadcareService = inject(UploadcareService);

    return injectMutation((client: QueryClient) => ({
      mutationFn: () =>
        lastValueFrom(profileService.uploadProfileAvatar(props.image_uuid)),
      retry: false,
      onMutate: async () => {
        await client.cancelQueries({ queryKey: profileKeys.currentProfile });
        const previousProfileData: CurrentProfileInterface | undefined =
          client.getQueryData(profileKeys.currentProfile);

        if (previousProfileData && previousProfileData?.avatar_url !== null) {
          profileService.deleteProfileAvatar();
          uploadcareService.deleteImageFromCdn(previousProfileData.avatar_url);
        }
      },
      onSuccess: () => {
        client.refetchQueries({ queryKey: userKeys.currentUser });
        client.refetchQueries({ queryKey: profileKeys.currentProfile });
        client.refetchQueries({ queryKey: ['profile'] });
      },
    }));
  });
};
