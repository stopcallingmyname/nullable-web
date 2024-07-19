import { ProjectInterface } from '../../project/types/project.interface';
import { TagInterface } from './tag.interface';

export interface CurrentProfileInterface {
  id: string;
  registration_date: string;
  full_name: string | null;
  location: string | null;
  bio: string | null;
  skills: TagInterface[] | null;
  projects: ProjectInterface[] | null;
  averageTimeSpent?: number;
  personal_website_url: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  behance_url: string | null;
  linkedIn_url: string | null;
  vimeo_url: string | null;
  isCurrent: boolean;
  isFollowing?: boolean;
  followers_count: number;
  following_count: number;
  projects_count: number;
  likes_count: number;
  open_to_work: boolean;
}
