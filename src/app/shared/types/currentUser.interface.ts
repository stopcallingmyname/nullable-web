import { CurrentProfileInterface } from './currentProfile.interface';
import { Role } from './role.enum';

export interface CurrentUserInterface {
  id: string;
  username: string;
  email: string;
  role: Role;
  profile: CurrentProfileInterface;
  registration_date: Date;
}
