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
