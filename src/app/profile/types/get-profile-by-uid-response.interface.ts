import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';

export interface GetProfileByUidResponseInterface {
  profile: CurrentProfileInterface;
  followers_count: number;
  following_count: number;
}
