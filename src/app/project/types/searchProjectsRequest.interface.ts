export interface SearchProjectRequestInterface {
  search: string;
  sortBy: 'new' | 'popular' | 'following';
  tags: string[];
}
