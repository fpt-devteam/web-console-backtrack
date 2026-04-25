// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useActivityLogs } from '@/hooks/use-activity-logs';
import { DashboardShell } from '@/components/dashboard';
import type { CardConfig, ChartPoint, TableRow } from '@/components/dashboard';
import { Spinner } from '@/components/ui/spinner';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

// 12-month mock sparkline for the chart; chart will slice based on range
const CHART_DATA: ChartPoint[] = [
  { label: 'May', logins: 420, actions: 198 },
  { label: 'Jun', logins: 480, actions: 210 },
  { label: 'Jul', logins: 510, actions: 240 },
  { label: 'Aug', logins: 490, actions: 225 },
  { label: 'Sep', logins: 540, actions: 280 },
  { label: 'Oct', logins: 620, actions: 310 },
  { label: 'Nov', logins: 680, actions: 340 },
  { label: 'Dec', logins: 720, actions: 380 },
  { label: 'Jan', logins: 760, actions: 400 },
  { label: 'Feb', logins: 700, actions: 360 },
  { label: 'Mar', logins: 810, actions: 440 },
  { label: 'Apr', logins: 850, actions: 470 },
];

const ACTION_COLUMNS: ColumnDef<TableRow>[] = [
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ getValue }) => {
      const v = getValue() as string;
      const a = v.toLowerCase();
      const cls = a.includes('login')
        ? 'bg-[#e8f9f0] text-[#06c167]'
        : a.includes('delete')
          ? 'bg-[#fff0f2] text-[#c13515]'
          : a.includes('update') || a.includes('edit')
            ? 'bg-[#fff8e6] text-[#c97a00]'
            : a.includes('create')
              ? 'bg-[#fff0f2] text-[#ff385c]'
              : 'bg-[#f7f7f7] text-[#6a6a6a]';
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{v}</span>
      );
    },
  },
  { accessorKey: 'details', header: 'Details' },
  { accessorKey: 'time', header: 'Time' },
];

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: logs, isLoading: logsLoading } = useActivityLogs(1, 10);

  if (statsLoading || logsLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards: CardConfig[] = [
    {
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() ?? '0',
      trend: '+47 this month',
      trendDirection: 'up',
      icon: <Users className="w-4 h-4" />,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers.toLocaleString() ?? '0',
      trend: '+12 this week',
      trendDirection: 'up',
      icon: <Activity className="w-4 h-4" />,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
    },
    {
      label: 'Total Revenue',
      value: `$${
        stats?.totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? '0.00'
      }`,
      trend: '+8.7%',
      trendDirection: 'up',
      icon: <DollarSign className="w-4 h-4" />,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
    },
    {
      label: 'Growth Rate',
      value: `${stats?.growthRate ?? '0'}%`,
      trend: '+2.1%',
      trendDirection: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      iconBg: 'bg-[#f7f7f7]',
      iconColor: 'text-[#6a6a6a]',
    },
  ];

  const tableData: TableRow[] = (logs?.items ?? []).map((log) => ({
    user: log.userName,
    action: log.action,
    details: log.details,
    time: formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }),
  }));

  return (
    <DashboardShell
      header={{
        title: 'Dashboard',
        subtitle: 'Welcome to the Backtrack Console',
      }}
      cards={cards}
      chart={{
        title: 'User Activity',
        data: CHART_DATA,
        series: [
          { key: 'logins', label: 'Logins', color: '#ff385c' },
          { key: 'actions', label: 'Actions', color: '#06c167' },
        ],
      }}
      table={{
        title: 'Recent Activity',
        columns: ACTION_COLUMNS,
        data: tableData,
        pageSize: 5,
      }}
    />
  );
}
