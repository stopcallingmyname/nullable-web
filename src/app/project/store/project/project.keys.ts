import { SearchProjectRequestInterface } from '../../types/searchProjectsRequest.interface';

export const projectKeys = {
  allProjects: ['all-projects'] as const,
  byUsername: (username: string) => ['projects', username] as const,
  likedByUsername: (username: string) => ['liked', username] as const,
  byPid: (pid: string) => ['project-id', pid] as const,
  foundBy: (dto: SearchProjectRequestInterface) => [
    'projects-found-by',
    dto.search,
    dto.sortBy,
    dto.tags,
  ],
};
