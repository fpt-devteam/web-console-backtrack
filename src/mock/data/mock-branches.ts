export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  managerEmail: string;
  employeeCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastUpdated: string;
}

export const mockBranches: Branch[] = [
  {
    id: 'br-001',
    name: 'San Francisco HQ',
    code: 'SF-HQ',
    address: '123 Market Street, Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'United States',
    phone: '+1 (415) 555-0123',
    email: 'sf.hq@acmecorp.com',
    manager: 'John Smith',
    managerEmail: 'john.smith@acmecorp.com',
    employeeCount: 45,
    status: 'active',
    createdAt: '2023-01-15',
    lastUpdated: '2024-01-10',
  },
  {
    id: 'br-002',
    name: 'Los Angeles Office',
    code: 'LA-OFF',
    address: '456 Wilshire Blvd, Floor 10',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90010',
    country: 'United States',
    phone: '+1 (213) 555-0456',
    email: 'la.office@acmecorp.com',
    manager: 'Sarah Johnson',
    managerEmail: 'sarah.johnson@acmecorp.com',
    employeeCount: 32,
    status: 'active',
    createdAt: '2023-03-20',
    lastUpdated: '2024-01-12',
  },
  {
    id: 'br-003',
    name: 'New York Branch',
    code: 'NY-BR',
    address: '789 5th Avenue, Suite 2000',
    city: 'New York',
    state: 'NY',
    zipCode: '10022',
    country: 'United States',
    phone: '+1 (212) 555-0789',
    email: 'ny.branch@acmecorp.com',
    manager: 'Michael Brown',
    managerEmail: 'michael.brown@acmecorp.com',
    employeeCount: 28,
    status: 'active',
    createdAt: '2023-05-10',
    lastUpdated: '2024-01-13',
  },
  {
    id: 'br-004',
    name: 'Austin Tech Hub',
    code: 'ATX-TH',
    address: '321 Congress Avenue, Building A',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'United States',
    phone: '+1 (512) 555-0321',
    email: 'austin.tech@acmecorp.com',
    manager: 'Emily Davis',
    managerEmail: 'emily.davis@acmecorp.com',
    employeeCount: 18,
    status: 'active',
    createdAt: '2023-08-01',
    lastUpdated: '2024-01-14',
  },
  {
    id: 'br-005',
    name: 'Seattle Innovation Center',
    code: 'SEA-IC',
    address: '555 Pike Street, Level 5',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'United States',
    phone: '+1 (206) 555-0555',
    email: 'seattle.innovation@acmecorp.com',
    manager: 'David Wilson',
    managerEmail: 'david.wilson@acmecorp.com',
    employeeCount: 22,
    status: 'pending',
    createdAt: '2023-11-15',
    lastUpdated: '2024-01-08',
  },
];

// For testing empty state, export an empty array option
export const mockBranchesEmpty: Branch[] = [];

