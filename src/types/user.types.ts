export interface UserProfile {
  id: string;
  email?: string | null;
  displayName?: string | null;
  globalRole: UserGlobalRoleType;
}

export const UserGlobalRole = {
  Customer: 'Customer',
  PlatformSuperAdmin: 'PlatformSuperAdmin',
  EnterpriseAdmin: 'EnterpriseAdmin',
} as const;

export type UserGlobalRoleType = typeof UserGlobalRole[keyof typeof UserGlobalRole];

const ROLE_VALUES = Object.values(UserGlobalRole) as readonly UserGlobalRoleType[];

export function parseUserGlobalRole(input: unknown): UserGlobalRoleType | null {
  if (typeof input !== "string") return null;
  return (ROLE_VALUES as readonly string[]).includes(input) ? (input as UserGlobalRoleType) : null;
}
