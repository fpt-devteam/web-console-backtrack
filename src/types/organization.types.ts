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
  /** BE CreateOrganizationCommand — optional */
  contactEmail?: string | null;
  industryType: string;
  taxIdentificationNumber: string;
  /** BE CreateOrganizationCommand: required */
  logoUrl: string;
  /** BE CreateOrganizationCommand: required — org policy for finder contact */
  requiredFinderContractFields: FinderContactField[];
  /** BE CreateOrganizationCommand: required — org policy for owner form */
  requiredOwnerContractFields: FinderContactField[];
}

/** BE FinderContactField — JSON PascalCase (JsonStringEnumConverter không có CamelCase policy) */
export type FinderContactField = 'Email' | 'Phone' | 'NationalId' | 'OrgMemberId';

/** BE WeekDay — JSON string enum */
export type OrgWeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

/** BE DailySchedule trong OrganizationResult */
export interface DailySchedule {
  day: OrgWeekDay;
  isClosed: boolean;
  openTime?: string | null;
  closeTime?: string | null;
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
  contactEmail?: string | null;
  /** BE OrganizationResult */
  logoUrl: string;
  coverImageUrl?: string | null;
  locationNote?: string | null;
  businessHours?: DailySchedule[] | null;
  status: string;
  createdAt: string;
  /** Các field finder bắt buộc theo cấu hình org (CreateInventoryItem) */
  requiredFinderContractFields?: FinderContactField[];
  requiredOwnerContractFields?: FinderContactField[];
}

/** Payload for PUT /api/core/orgs/{orgId} – matches UpdateOrganizationCommand */
export interface UpdateOrganizationPayload {
  name: string;
  slug: string;
  displayAddress?: string | null;
  location?: { latitude: number; longitude: number } | null;
  externalPlaceId?: string | null;
  phone: string;
  contactEmail?: string | null;
  industryType: string;
  taxIdentificationNumber: string;
  locationNote?: string | null;
  businessHours?: DailySchedule[] | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  requiredFinderContractFields?: FinderContactField[] | null;
  requiredOwnerContractFields?: FinderContactField[] | null;
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
  /** Present when BE includes it on my-orgs response */
  logoUrl?: string | null;
  orgStatus: string;
  myRole: string;
  joinedAt: string;
}
