/** BE CreateOrganizationCommand: Location + DisplayAddress required (không còn address) */
export interface CreateOrganizationPayload {
  name: string;
  slug: string;
  /** Địa chỉ hiển thị (bắt buộc trên BE) */
  displayAddress: string;
  /** Tọa độ (bắt buộc trên BE); không có map thì gửi 0,0 */
  location: { latitude: number; longitude: number };
  externalPlaceId?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
}

/** BE OrganizationResult / GET /api/core/orgs/{id} */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  displayAddress?: string | null;
  location?: { latitude: number; longitude: number } | null;
  externalPlaceId?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
  status: string;
  createdAt: string;
}

/** Payload for PUT /api/core/orgs/{orgId} – matches UpdateOrganizationCommand */
export interface UpdateOrganizationPayload {
  name: string;
  slug: string;
  displayAddress?: string | null;
  location?: { latitude: number; longitude: number } | null;
  externalPlaceId?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
}

/** Thành viên org – item từ GET /api/core/orgs/{orgId}/members */
export interface OrgMember {
  membershipId: string;
  userId: string;
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  joinedAt: string;
}

/** Item from GET /api/core/orgs/me (MyOrganizationResult) */
export interface MyOrganization {
  orgId: string;
  name: string;
  slug: string;
  displayAddress: string;
  location: { latitude: number; longitude: number };
  externalPlaceId?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
  orgStatus: string;
  myRole: string;
  joinedAt: string;
}
