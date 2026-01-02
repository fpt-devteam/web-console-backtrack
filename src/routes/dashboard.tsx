import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react';
import { Users, Activity, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useActivityLogs } from '@/hooks/use-activity-logs';
import { Spinner } from '@/components/ui/spinner';
import { showToast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activityLogs, isLoading: logsLoading, error: logsError } = useActivityLogs(1, 5);

  if (statsError) {
    showToast.fromError(statsError);
  }

  if (logsError) {
    showToast.fromError(logsError);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome to the Backtrack Console
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() ?? '0'}
            icon={<Users className="w-6 h-6" />}
            color="primary"
            isLoading={statsLoading}
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers.toLocaleString() ?? '0'}
            icon={<Activity className="w-6 h-6" />}
            color="success"
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="warning"
            isLoading={statsLoading}
          />
          <StatCard
            title="Growth Rate"
            value={`${stats?.growthRate ?? '0'}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="secondary"
            isLoading={statsLoading}
          />
        </div>

        {/* Activity Logs */}
        <Card>
          <CardHeader className="flex gap-3">
            <Clock className="w-5 h-5" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Recent Activity</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest user actions and system events
              </p>
            </div>
          </CardHeader>
          <CardBody>
            {logsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <Table aria-label="Activity logs table">
                <TableHeader>
                  <TableColumn>USER</TableColumn>
                  <TableColumn>ACTION</TableColumn>
                  <TableColumn>DETAILS</TableColumn>
                  <TableColumn>TIME</TableColumn>
                </TableHeader>
                <TableBody>
                  {activityLogs?.items.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userName}</TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getActionColor(log.action)}
                        >
                          {log.action}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  )) ?? []}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
          <CardBody className="text-white p-6">
            <h3 className="text-xl font-bold mb-2">
              This is a Demo Dashboard
            </h3>
            <p className="text-blue-100">
              This dashboard demonstrates the integration of HeroUI components with TanStack Query.
              The data shown here is mock data for demonstration purposes. Set USE_MOCK_DATA to false
              in analytics.service.ts to use real API endpoints.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'secondary' | 'danger' | 'default';
  isLoading: boolean;
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex flex-row items-center gap-4 p-6">
        <div className={`p-3 rounded-full bg-${color}/10`}>
          <div className={`text-${color}`}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function getActionColor(action: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('login')) return 'success';
  if (lowerAction.includes('delete')) return 'danger';
  if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'warning';
  if (lowerAction.includes('create')) return 'primary';
  return 'default';
}
