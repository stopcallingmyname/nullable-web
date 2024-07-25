export const profileKeys = {
  allProfiles: ['all-profiles'] as const,
  currentProfile: ['current-profile'] as const,
  byUsername: (username: string) => ['profile', username] as const,
  byUid: (uid: string) => ['profile-uid', uid] as const,
};
