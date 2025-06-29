export const userKeys = {
  currentUser: ['current-user'] as const,
  byProfileId: (profile_id: string) => ['profile-id', profile_id] as const,
};
