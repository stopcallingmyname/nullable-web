import { CurrentProfileInterface } from '../../shared/types/currentProfile.interface';
import { TagInterface } from '../../shared/types/tag.interface';

export interface ProjectInterface {
  id: string;
  preview_url: string;
  title: string;
  description: string;
  creator: CurrentProfileInterface;
  components: any[];
  tags?: TagInterface[];
  timeSpent?: number;
  likes: number;
  views: number;
  created_at: Date;
  updatedAt: Date;
  isLiked?: boolean;
}
