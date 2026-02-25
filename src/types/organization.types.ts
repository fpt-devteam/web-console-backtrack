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
