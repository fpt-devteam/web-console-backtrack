// src/modules/console/pages/admin/dashboard.tsx
import { Layout } from '../../components/admin/layout';
import { Users, Package, CheckCircle, Activity } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { DashboardShell } from '@/components/dashboard';
import type { CardConfig, ChartPoint, TableRow } from '@/components/dashboard';
import { mockDashboardStats } from '@/mock/data/mock-admin-dashboard';

// 12-month item activity data
const CHART_DATA: ChartPoint[] = [
  { label: 'May', found: 28, returned: 22 },
  { label: 'Jun', found: 34, returned: 28 },
  { label: 'Jul', found: 38, returned: 32 },
  { label: 'Aug', found: 42, returned: 36 },
  { label: 'Sep', found: 36, returned: 30 },
  { label: 'Oct', found: 45, returned: 40 },
  { label: 'Nov', found: 52, returned: 46 },
  { label: 'Dec', found: 48, returned: 43 },
  { label: 'Jan', found: 55, returned: 50 },
  { label: 'Feb', found: 50, returned: 44 },
  { label: 'Mar', found: 60, returned: 55 },
  { label: 'Apr', found: 65, returned: 58 },
];

// Mock inventory items for the table
const TABLE_DATA: TableRow[] = [
  { item: 'Blue Backpack', category: 'Bags', status: 'In Storage', staff: 'Nguyen V.A' },
  { item: 'iPhone 14 Pro', category: 'Electronics', status: 'Returned', staff: 'Tran T.B' },
  { item: 'Leather Wallet', category: 'Personal', status: 'Active', staff: 'Le V.C' },
  { item: 'Laptop Bag', category: 'Bags', status: 'In Storage', staff: 'Nguyen V.A' },
  { item: 'AirPods Pro', category: 'Electronics', status: 'Returned', staff: 'Tran T.B' },
  { item: 'Sunglasses', category: 'Accessories', status: 'Active', staff: 'Le V.C' },
  { item: 'Black Umbrella', category: 'Accessories', status: 'In Storage', staff: 'Nguyen V.A' },
];

const STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-[#fff0f2] text-[#ff385c]',
  'In Storage': 'bg-[#f7f7f7] text-[#6a6a6a]',
  Returned: 'bg-[#e8f9f0] text-[#06c167]',
  'Return Scheduled': 'bg-[#fff8e6] text-[#c97a00]',
};

const ITEM_COLUMNS: ColumnDef<TableRow>[] = [
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue() as string;
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            STATUS_CLASSES[v] ?? 'bg-[#f7f7f7] text-[#6a6a6a]'
          }`}
        >
          {v}
        </span>
      );
    },
  },
  { accessorKey: 'staff', header: 'Staff' },
];

const stats = mockDashboardStats;

export function AdminDashboardPage() {
  const cards: CardConfig[] = [
    {
      label: 'Active Staff',
      value: String(stats.activeStaff.count),
      trend: stats.activeStaff.change,
      trendDirection: stats.activeStaff.trend === 'up' ? 'up' : 'down',
      icon: <Users className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Active Items',
      value: String(stats.activeItems.count),
      trend: stats.activeItems.description,
      trendDirection: 'neutral',
      icon: <Package className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Return Rate',
      value: `${stats.returnRate.percentage}%`,
      trend: stats.returnRate.change,
      trendDirection: stats.returnRate.trend === 'up' ? 'up' : 'down',
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
    },
    {
      label: 'Found Today',
      value: '6',
      trend: '−2 vs yesterday',
      trendDirection: 'down',
      icon: <Activity className="w-4 h-4" />,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
    },
  ];

  return (
    <Layout>
      <DashboardShell
        header={{
          title: 'Dashboard',
          subtitle: "Welcome back — here's an overview of your organization.",
        }}
        cards={cards}
        chart={{
          title: 'Item Activity',
          data: CHART_DATA,
          series: [
            { key: 'found', label: 'Found', color: '#ff385c' },
            { key: 'returned', label: 'Returned', color: '#06c167' },
          ],
        }}
        table={{
          title: 'Recent Items',
          columns: ITEM_COLUMNS,
          data: TABLE_DATA,
          pageSize: 5,
        }}
      />
    </Layout>
  );
}
