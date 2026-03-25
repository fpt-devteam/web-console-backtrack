export interface UserProfile {
  id: string;
  email?: string | null;
  displayName?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  showEmail?: boolean;
  showPhone?: boolean;
  globalRole: UserGlobalRoleType;
}

export const UserGlobalRole = {
  // Keep FE values aligned with BE enum names (see Backtrack.Core.Domain.Constants.UserRole)
  // BE returns: "Customer" | "PlatformSuperAdmin"
  USER: 'Customer',
  SUPER_ADMIN: 'PlatformSuperAdmin',

  // Aliases (useful if other parts of FE use "Customer"/"PlatformSuperAdmin" naming)
  Customer: 'Customer',
  PlatformSuperAdmin: 'PlatformSuperAdmin',
} as const;

export type UserGlobalRoleType = typeof UserGlobalRole[keyof typeof UserGlobalRole];

const ROLE_VALUES = Object.values(UserGlobalRole) as readonly UserGlobalRoleType[];

export function parseUserGlobalRole(input: unknown): UserGlobalRoleType | null {
  if (typeof input !== "string") return null;
  return (ROLE_VALUES as readonly string[]).includes(input) ? (input as UserGlobalRoleType) : null;
}
