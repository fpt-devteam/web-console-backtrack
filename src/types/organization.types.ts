export interface CreateOrganizationPayload {
  name: string;
  slug: string;
  address?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
  status: string;
  createdAt: string;
}

/** Payload cho PUT /api/core/orgs/{orgId} (TaxId gửi nguyên từ GET, không đổi) */
export interface UpdateOrganizationPayload {
  name: string;
  slug: string;
  address?: string | null;
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

/** Item trả về từ GET /api/core/orgs/me */
export interface MyOrganization {
  orgId: string;
  name: string;
  slug: string;
  address?: string | null;
  phone: string;
  industryType: string;
  taxIdentificationNumber: string;
  orgStatus: string;
  myRole: string;
  joinedAt: string;
}
