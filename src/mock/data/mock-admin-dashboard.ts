/**
 * Mock data for Admin Dashboard
 */

export interface DashboardStats {
  activeStaff: {
    count: number;
    change: string;
    trend: 'up' | 'down';
  };
  activeItems: {
    count: number;
    description: string;
  };
  returnRate: {
    percentage: number;
    change: string;
    trend: 'up' | 'down';
  };
}

export interface ItemStatusData {
  found: number;
  returned: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'found' | 'staff' | 'claimed';
  title: string;
  description: string;
  time: string;
  icon: string;
}

export interface StoragePlan {
  name: string;
  status: 'active' | 'inactive';
  used: number;
  total: number;
}

export const mockDashboardStats: DashboardStats = {
  activeStaff: {
    count: 24,
    change: '+2 this week',
    trend: 'up',
  },
  activeItems: {
    count: 142,
    description: 'Currently in storage',
  },
  returnRate: {
    percentage: 85,
    change: '+5% vs last month',
    trend: 'up',
  },
};

export const mockItemStatusData: ItemStatusData = {
  found: 320,
  returned: 458,
};

export const mockRecentActivity: RecentActivityItem[] = [
  {
    id: '1',
    type: 'found',
    title: 'iPhone 14 Pro found',
    description: 'Logged by Sarah J. at Front Desk',
    time: '2m ago',
    icon: '',
  },
  {
    id: '2',
    type: 'staff',
    title: 'New staff member invited',
    description: 'Mike Ross invited as Admin',
    time: '1h ago',
    icon: '',
  },
  {
    id: '3',
    type: 'claimed',
    title: 'Black Wallet claimed',
    description: 'Returned to owner',
    time: '3h ago',
    icon: '',
  },
];

export const mockStoragePlan: StoragePlan = {
  name: 'PRO PLAN',
  status: 'active',
  used: 750,
  total: 1000,
};

