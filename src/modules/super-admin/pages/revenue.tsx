import { Layout } from '../components/layout';
import { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  Building2,
  Package,
  QrCode,
  User,
} from 'lucide-react';
import {
  mockRevenueTransactions,
  mockRevenueSummary,
  mockMonthlyRevenue,
  type RevenueStatus,
  type PaymentMethod,
  type RevenueType,
} from '@/mock/data/mock-revenue';
import { TableFiltersBar } from '@/components/filters/table-filters-bar';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * Revenue Management Page
 * 
 * Displays comprehensive revenue analytics, transaction history,
 * and financial metrics for all tenant organizations.
 * 
 * Features:
 * - Revenue summary cards with key metrics
 * - Monthly revenue chart visualization
 * - Transaction table with search and filters
 * - Export functionality
 * - Payment method and status filtering
 */
export function RevenuePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [revenueTypeFilter, setRevenueTypeFilter] = useState<RevenueType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<RevenueStatus | 'All'>('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | 'All'>('All');
  const [timeFilter, setTimeFilter] = useState<'12months' | '6months' | '3months' | '1month'>('12months');
  const [chartView, setChartView] = useState<'All' | 'Subscription' | 'QR Sales'>('All');
  const pageSize = 10;

  /**
   * Filters transactions based on revenue type, search term, status, and payment method
   */
  const filteredTransactions = useMemo(() => {
    return mockRevenueTransactions.filter((transaction) => {
      const matchesRevenueType =
        revenueTypeFilter === 'All' || transaction.revenueType === revenueTypeFilter;
      const matchesSearch =
        transaction.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.qrCodeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
      const matchesPaymentMethod =
        paymentMethodFilter === 'All' || transaction.paymentMethod === paymentMethodFilter;
      return (
        matchesRevenueType && matchesSearch && matchesStatus && matchesPaymentMethod
      );
    });
  }, [revenueTypeFilter, searchTerm, statusFilter, paymentMethodFilter]);

  /**
   * Sorts transactions by date (newest first)
   */
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => b.transactionDate.getTime() - a.transactionDate.getTime()
    );
  }, [filteredTransactions]);

  /**
   * Pagination calculations
   */
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  /**
   * Gets chart data based on time filter and chart view
   * 
   * @returns Chart data array
   */
  const getChartData = () => {
    let data = [];
    switch (timeFilter) {
      case '12months':
        data = mockMonthlyRevenue;
        break;
      case '6months':
        data = mockMonthlyRevenue.slice(6);
        break;
      case '3months':
        data = mockMonthlyRevenue.slice(9);
        break;
      case '1month':
        data = [mockMonthlyRevenue[11]];
        break;
      default:
        data = mockMonthlyRevenue;
    }

    // Return data based on chart view
    if (chartView === 'All') {
      return data.map((item) => ({
        month: item.month,
        subscription: item.subscription,
        qrSales: item.qrSales,
      }));
    } else if (chartView === 'Subscription') {
      return data.map((item) => ({
        month: item.month,
        revenue: item.subscription,
      }));
    } else {
      return data.map((item) => ({
        month: item.month,
        revenue: item.qrSales,
      }));
    }
  };

  /**
   * Gets status badge color based on transaction status
   * 
   * @param status - Transaction status
   * @returns CSS classes for status badge
   */
  const getStatusBadgeClass = (status: RevenueStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Refunded':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  /**
   * Formats currency amount
   * 
   * @param amount - Amount to format
   * @param currency - Currency code
   * @returns Formatted currency string
   */
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Formats date to readable string
   * 
   * @param date - Date to format
   * @returns Formatted date string
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Handles export revenue data
   */
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export revenue data');
  };

  /**
   * Handles view transaction details
   * 
   * @param transactionId - ID of the transaction to view
   */
  const handleViewTransaction = (transactionId: string) => {
    // TODO: Implement view transaction details
    console.log('View transaction:', transactionId);
  };

  // Filter options
  const statusOptions = [
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Refunded', label: 'Refunded' },
  ];

  const paymentMethodOptions = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'Stripe', label: 'Stripe' },
    { value: 'Wire Transfer', label: 'Wire Transfer' },
  ];

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Revenue</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Management</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Management</h1>
            <p className="text-gray-600">
              Monitor and manage revenue transactions, subscriptions, and financial metrics.
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +{mockRevenueSummary.growthPercentage}%
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(mockRevenueSummary.totalRevenue)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-blue-600">
                {formatCurrency(mockRevenueSummary.subscriptionRevenue)} Subscriptions
              </span>
              {' • '}
              <span className="text-purple-600">
                {formatCurrency(mockRevenueSummary.qrSalesRevenue)} QR Sales
              </span>
            </div>
          </div>

          {/* Subscription Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm text-gray-500">From Tenants</div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Subscription Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(mockRevenueSummary.subscriptionRevenue)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {mockRevenueSummary.subscriptionTransactions} transactions
            </div>
          </div>

          {/* QR Sales Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-500">From End Users</div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">QR Sales Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(mockRevenueSummary.qrSalesRevenue)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {mockRevenueSummary.qrSalesTransactions} transactions
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(mockRevenueSummary.monthlyRevenue)}
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Monthly Revenue Trend</h2>
              <p className="text-sm text-gray-500">Revenue growth over selected period</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value as typeof chartView)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Revenue</option>
                  <option value="Subscription">Subscription Only</option>
                  <option value="QR Sales">QR Sales Only</option>
                </select>
              </div>
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="12months">12 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="3months">3 Months</option>
                  <option value="1month">1 Month</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number | undefined) => {
                    if (value === undefined || value === null) return '$0.00';
                    return formatCurrency(value);
                  }}
                />
                {chartView === 'All' ? (
                  <>
                    <Bar
                      dataKey="subscription"
                      fill="#3b82f6"
                      name="Subscription"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="qrSales"
                      fill="#9333ea"
                      name="QR Sales"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                  </>
                ) : (
                  <Bar
                    dataKey="revenue"
                    fill={chartView === 'Subscription' ? '#3b82f6' : '#9333ea'}
                    name={chartView}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by tenant, user, invoice, QR code, or description..."
          filters={[
            {
              label: 'Revenue Type',
              value: revenueTypeFilter,
              onChange: (value) => setRevenueTypeFilter(value as typeof revenueTypeFilter),
              options: [
                { value: 'Subscription', label: 'Subscription' },
                { value: 'QR Sales', label: 'QR Sales' },
              ],
              allLabel: 'All',
            },
            {
              label: 'Status',
              value: statusFilter,
              onChange: (value) => setStatusFilter(value as typeof statusFilter),
              options: statusOptions,
              allLabel: 'All',
            },
            {
              label: 'Payment Method',
              value: paymentMethodFilter,
              onChange: (value) => setPaymentMethodFilter(value as typeof paymentMethodFilter),
              options: paymentMethodOptions,
              allLabel: 'All',
            },
          ]}
          className="mb-6"
        />

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTransactions.map((transaction) => {
                  const statusBadgeClass = getStatusBadgeClass(transaction.status);
                  const isSubscription = transaction.revenueType === 'Subscription';
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isSubscription
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {transaction.revenueType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {transaction.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSubscription ? 'bg-blue-100' : 'bg-purple-100'
                            }`}
                          >
                            {isSubscription ? (
                              <Building2 className="w-4 h-4 text-blue-600" />
                            ) : (
                              <User className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {isSubscription ? transaction.tenantName : transaction.userName}
                            </span>
                            {isSubscription && transaction.subscriptionPlan && (
                              <span className="text-xs text-gray-500">
                                {transaction.subscriptionPlan}
                              </span>
                            )}
                            {!isSubscription && transaction.qrCodeName && (
                              <span className="text-xs text-gray-500">
                                {transaction.qrCodeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadgeClass}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatDate(transaction.transactionDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSubscription ? (
                          <span className="text-sm text-gray-600 font-mono">
                            {transaction.invoiceNumber || 'N/A'}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600 font-mono">
                            {transaction.qrCodeId || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewTransaction(transaction.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Transaction Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedTransactions.length)} of{' '}
              {sortedTransactions.length} results
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

