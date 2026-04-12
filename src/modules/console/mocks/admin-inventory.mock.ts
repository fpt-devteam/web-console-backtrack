export const ADMIN_MOCK_ORG_ID = '00000000-0000-0000-0000-000000000001';

export type AdminInventoryItemMock = {
  id: string;
  orgId: string;
  loggedById: string;
  itemName: string;
  description: string;
  distinctiveMarks?: string | null;
  imageUrls: string[];
  storageLocation?: string | null;
  status: string;
  loggedAt: string;
  createdAt: string;
};

export const MOCK_ADMIN_INVENTORY_ITEMS: AdminInventoryItemMock[] = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-01',
    itemName: 'Black The North Face backpack',
    description: 'Found on the 2nd floor study area. No name tag; small bear keychain attached.',
    distinctiveMarks: 'Small brown bear keychain',
    imageUrls: ['https://picsum.photos/seed/inv01/800/600'],
    storageLocation: 'Warehouse A · Shelf B12',
    status: 'InStorage',
    loggedAt: '2026-03-10T08:30:00.000Z',
    createdAt: '2026-03-10T08:30:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-02',
    itemName: 'Gray windbreaker jacket',
    description: 'Size M, school logo on the back. Found near the cafeteria.',
    distinctiveMarks: null,
    imageUrls: ['https://picsum.photos/seed/inv02/800/600', 'https://picsum.photos/seed/inv02b/800/600'],
    storageLocation: 'Warehouse A · Shelf C04',
    status: 'InStorage',
    loggedAt: '2026-03-11T14:15:00.000Z',
    createdAt: '2026-03-11T14:15:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-01',
    itemName: 'Wireless earbuds (white case)',
    description: 'AirPods-style case still has charge. No name on case.',
    distinctiveMarks: 'Light scratch on left corner of case',
    imageUrls: ['https://picsum.photos/seed/inv03/800/600'],
    storageLocation: 'Secure cabinet · Bin 3',
    status: 'Returned',
    loggedAt: '2026-03-05T09:00:00.000Z',
    createdAt: '2026-03-05T09:00:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-03',
    itemName: 'Motorcycle keys (Honda)',
    description: 'Metal ring with remote fob.',
    distinctiveMarks: null,
    imageUrls: [],
    storageLocation: 'Front desk',
    status: 'InStorage',
    loggedAt: '2026-03-12T11:20:00.000Z',
    createdAt: '2026-03-12T11:20:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000005',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-02',
    itemName: 'Stanley 750ml thermos',
    description: 'Moss green with a leaf sticker.',
    distinctiveMarks: 'Leaf sticker',
    imageUrls: ['https://picsum.photos/seed/inv05/800/600'],
    storageLocation: 'Warehouse B · Shelf A01',
    status: 'InStorage',
    loggedAt: '2026-03-14T16:45:00.000Z',
    createdAt: '2026-03-14T16:45:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000006',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-01',
    itemName: 'Black 13" laptop sleeve',
    description: 'Water-resistant fabric, YKK zipper.',
    distinctiveMarks: null,
    imageUrls: ['https://picsum.photos/seed/inv06/800/600'],
    storageLocation: 'Warehouse A',
    status: 'Disposed',
    loggedAt: '2026-02-28T10:00:00.000Z',
    createdAt: '2026-02-28T10:00:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000007',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-03',
    itemName: 'Black folding umbrella',
    description: 'Brand unknown, black plastic handle.',
    distinctiveMarks: null,
    imageUrls: ['https://picsum.photos/seed/inv07/800/600'],
    storageLocation: 'Warehouse B',
    status: 'Returned',
    loggedAt: '2026-03-08T13:00:00.000Z',
    createdAt: '2026-03-08T13:00:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000008',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-02',
    itemName: 'Brown leather wallet (men)',
    description: 'Documents inside were handed to security.',
    distinctiveMarks: 'Engraved initials T.V.',
    imageUrls: ['https://picsum.photos/seed/inv08/800/600'],
    storageLocation: 'Secure cabinet',
    status: 'InStorage',
    loggedAt: '2026-03-15T08:00:00.000Z',
    createdAt: '2026-03-15T08:00:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000009',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-01',
    itemName: 'Advanced calculus textbook',
    description: 'Volume 1, class name written inside cover.',
    distinctiveMarks: 'Name: Minh (handwritten)',
    imageUrls: [],
    storageLocation: 'Warehouse A · Shelf D01',
    status: 'InStorage',
    loggedAt: '2026-03-16T09:30:00.000Z',
    createdAt: '2026-03-16T09:30:00.000Z',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000010',
    orgId: ADMIN_MOCK_ORG_ID,
    loggedById: 'staff-03',
    itemName: 'Black frame prescription glasses',
    description: 'In a clear plastic case; no prescription label on box.',
    distinctiveMarks: null,
    imageUrls: ['https://picsum.photos/seed/inv10/800/600', 'https://picsum.photos/seed/inv10b/800/600'],
    storageLocation: 'Front desk',
    status: 'InStorage',
    loggedAt: '2026-03-17T07:45:00.000Z',
    createdAt: '2026-03-17T07:45:00.000Z',
  },
];

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function matchesSearch(item: AdminInventoryItemMock, q: string) {
  if (!q) return true;
  const n = normalize(q);
  return (
    normalize(item.itemName).includes(n) ||
    normalize(item.description).includes(n) ||
    (item.distinctiveMarks && normalize(item.distinctiveMarks).includes(n)) ||
    (item.storageLocation && normalize(item.storageLocation).includes(n))
  );
}

export interface MockAdminInventoryQuery {
  page: number;
  pageSize: number;
  status?: string;
  searchTerm?: string;
}

export function queryMockAdminInventory(params: MockAdminInventoryQuery): {
  items: AdminInventoryItemMock[];
  totalCount: number;
} {
  let list = [...MOCK_ADMIN_INVENTORY_ITEMS];

  if (params.status && params.status !== 'All') {
    list = list.filter((i) => i.status === params.status);
  }

  const search = params.searchTerm?.trim();
  if (search) {
    list = list.filter((i) => matchesSearch(i, search));
  }

  const totalCount = list.length;
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  return { items, totalCount };
}

export function getMockAdminInventoryById(id: string): AdminInventoryItemMock | undefined {
  return MOCK_ADMIN_INVENTORY_ITEMS.find((i) => i.id === id);
}
