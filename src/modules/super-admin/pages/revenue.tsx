import { Layout } from '../components/layout';
import { useState, useMemo } from 'react';
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { SiteHeader } from '@/components/layout/site-header';

export function RevenuePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const [revenueTypeFilter, setRevenueTypeFilter] = useState<RevenueType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<RevenueStatus | 'All'>('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | 'All'>('All');
  const [timeFilter, setTimeFilter] = useState<'12months' | '6months' | '3months' | '1month'>('12months');
  const [chartView, setChartView] = useState<'All' | 'Subscription' | 'QR Sales'>('All');
  const pageSize = 10;

  const filteredTransactions = useMemo(() => {
    return mockRevenueTransactions.filter((t) => {
      const matchesType = revenueTypeFilter === 'All' || t.revenueType === revenueTypeFilter;
      const matchesSearch =
        t.tenantName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.userName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.invoiceNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.qrCodeName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPayment = paymentMethodFilter === 'All' || t.paymentMethod === paymentMethodFilter;
      return matchesType && matchesSearch && matchesStatus && matchesPayment;
    });
  }, [revenueTypeFilter, debouncedSearchTerm, statusFilter, paymentMethodFilter]);

  const sortedTransactions = useMemo(
    () => [...filteredTransactions].sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime()),
    [filteredTransactions],
  );

  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTransactions = sortedTransactions.slice(startIndex, startIndex + pageSize);

  const getChartData = () => {
    let data = mockMonthlyRevenue;
    if (timeFilter === '6months') data = mockMonthlyRevenue.slice(6);
    else if (timeFilter === '3months') data = mockMonthlyRevenue.slice(9);
    else if (timeFilter === '1month') data = [mockMonthlyRevenue[11]];

    if (chartView === 'All') {
      return data.map((d) => ({ month: d.month, subscription: d.subscription, qrSales: d.qrSales }));
    }
    return data.map((d) => ({
      month: d.month,
      revenue: chartView === 'Subscription' ? d.subscription : d.qrSales,
    }));
  };

  const getStatusBadgeClass = (status: RevenueStatus) => {
    switch (status) {
      case 'Completed': return 'bg-[#e8f9f0] text-[#06c167]';
      case 'Pending':   return 'bg-[#fff8e6] text-[#c97a00]';
      case 'Failed':    return 'bg-[#fff0f2] text-[#c13515]';
      case 'Refunded':  return 'bg-[#f7f7f7] text-[#6a6a6a]';
      default:          return 'bg-[#f7f7f7] text-[#6a6a6a]';
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  /** Compact Y-axis labels: $300K, $1.2M */
  const formatYAxis = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
  };

  const handleExport = () => console.log('Export revenue data');
  const handleViewTransaction = (id: string) => console.log('View transaction:', id);

  const statusOptions = [
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending',   label: 'Pending' },
    { value: 'Failed',    label: 'Failed' },
    { value: 'Refunded',  label: 'Refunded' },
  ];

  const paymentMethodOptions = [
    { value: 'Credit Card',    label: 'Credit Card' },
    { value: 'Bank Transfer',  label: 'Bank Transfer' },
    { value: 'PayPal',         label: 'PayPal' },
    { value: 'Stripe',         label: 'Stripe' },
    { value: 'Wire Transfer',  label: 'Wire Transfer' },
  ];

  // ─── Stat card data ────────────────────────────────────────────────────────
  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(mockRevenueSummary.totalRevenue),
      icon: DollarSign,
      iconBg: 'bg-[#e8f9f0]',
      iconColor: 'text-[#06c167]',
      meta: (
        <span className="flex items-center gap-1 text-xs font-semibold text-[#06c167]">
          <TrendingUp className="w-3 h-3" />
          +{mockRevenueSummary.growthPercentage}% vs last period
        </span>
      ),
    },
    {
      label: 'Subscription Revenue',
      value: formatCurrency(mockRevenueSummary.subscriptionRevenue),
      icon: Package,
      iconBg: 'bg-[#fff0f2]',
      iconColor: 'text-[#ff385c]',
      meta: <span className="text-xs text-[#929292]">{mockRevenueSummary.subscriptionTransactions.toLocaleString()} transactions · From Tenants</span>,
    },
    {
      label: 'QR Sales Revenue',
      value: formatCurrency(mockRevenueSummary.qrSalesRevenue),
      icon: QrCode,
      iconBg: 'bg-[#f7f7f7]',
      iconColor: 'text-[#6a6a6a]',
      meta: <span className="text-xs text-[#929292]">{mockRevenueSummary.qrSalesTransactions.toLocaleString()} transactions · From End Users</span>,
    },
    {
      label: 'This Month',
      value: formatCurrency(mockRevenueSummary.monthlyRevenue),
      icon: Calendar,
      iconBg: 'bg-[#fff8e6]',
      iconColor: 'text-[#c97a00]',
      meta: <span className="text-xs text-[#929292]">Monthly Revenue</span>,
    },
  ];

  return (
    <Layout>
      <SiteHeader
        crumbs={[{ label: 'Revenue Management' }]}
        actions={
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="rounded-[20px] border-[#dddddd] text-[#6a6a6a] hover:bg-[#f7f7f7] gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-[14px] border border-[#dddddd] p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm text-[#6a6a6a]">{card.label}</span>
                  <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#222222] tracking-tight mb-2">
                  {card.value}
                </p>
                {card.meta}
              </div>
            );
          })}
        </div>

        {/* ── Revenue chart ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-6">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-[#222222]">Monthly Revenue Trend</h2>
              <p className="text-sm text-[#929292] mt-0.5">Revenue growth over selected period</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Select value={chartView} onValueChange={(v) => setChartView(v as typeof chartView)}>
                <SelectTrigger className="h-8 w-[150px] border-[#dddddd] text-sm text-[#222222] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Revenue</SelectItem>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                  <SelectItem value="QR Sales">QR Sales</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as typeof timeFilter)}>
                <SelectTrigger className="h-8 w-[120px] border-[#dddddd] text-sm text-[#222222] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12months">12 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ top: 4, right: 16, left: 8, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#929292', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: '#929292', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #dddddd', borderRadius: '10px', fontSize: 13 }}
                  formatter={(value: number | undefined) => [value != null ? formatCurrency(value) : '$0', undefined]}
                  cursor={{ fill: '#f7f7f7' }}
                />
                {chartView === 'All' ? (
                  <>
                    {/* Stacked: subscription base, QR Sales on top */}
                    <Bar dataKey="subscription" stackId="rev" fill="#ff385c" name="Subscription" radius={[0, 0, 0, 0]} animationDuration={600} />
                    <Bar dataKey="qrSales"      stackId="rev" fill="#929292" name="QR Sales"     radius={[6, 6, 0, 0]} animationDuration={600} />
                    <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13 }} iconType="circle" />
                  </>
                ) : (
                  <Bar
                    dataKey="revenue"
                    fill={chartView === 'Subscription' ? '#ff385c' : '#929292'}
                    name={chartView}
                    radius={[6, 6, 0, 0]}
                    animationDuration={600}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <TableFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by tenant, user, invoice, QR code…"
          filters={[
            {
              label: 'Revenue Type',
              value: revenueTypeFilter,
              onChange: (v) => setRevenueTypeFilter(v as typeof revenueTypeFilter),
              options: [
                { value: 'Subscription', label: 'Subscription' },
                { value: 'QR Sales', label: 'QR Sales' },
              ],
              allLabel: 'All',
            },
            {
              label: 'Status',
              value: statusFilter,
              onChange: (v) => setStatusFilter(v as typeof statusFilter),
              options: statusOptions,
              allLabel: 'All',
            },
            {
              label: 'Payment Method',
              value: paymentMethodFilter,
              onChange: (v) => setPaymentMethodFilter(v as typeof paymentMethodFilter),
              options: paymentMethodOptions,
              allLabel: 'All',
            },
          ]}
        />

        {/* ── Transactions table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#dddddd]">
                <tr>
                  {['Type', 'Customer', 'Amount', 'Status', 'Payment', 'Date', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-[#929292] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {currentTransactions.map((t) => {
                  const isSub = t.revenueType === 'Subscription';
                  const customerName = isSub ? t.tenantName : t.userName;
                  const customerSub  = isSub ? t.subscriptionPlan : t.qrCodeName;
                  return (
                    <tr key={t.id} className="hover:bg-[#fafafa] transition-colors">
                      {/* Type */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSub ? 'bg-[#fff0f2] text-[#ff385c]' : 'bg-[#f7f7f7] text-[#6a6a6a]'}`}>
                          {t.revenueType}
                        </span>
                      </td>
                      {/* Customer */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isSub ? 'bg-[#fff0f2]' : 'bg-[#f7f7f7]'}`}>
                            {isSub
                              ? <Building2 className="w-3.5 h-3.5 text-[#ff385c]" />
                              : <User className="w-3.5 h-3.5 text-[#6a6a6a]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#222222] truncate">{customerName}</p>
                            {customerSub && (
                              <p className="text-xs text-[#929292] truncate">{customerSub}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-[#222222]">
                          {formatCurrency(t.amount, t.currency)}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      {/* Payment */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm text-[#6a6a6a]">{t.paymentMethod}</span>
                      </td>
                      {/* Date */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm text-[#6a6a6a]">{formatDate(t.transactionDate)}</span>
                      </td>
                      {/* Action */}
                      <td className="px-5 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleViewTransaction(t.id)}
                          className="p-1.5 text-[#929292] hover:text-[#ff385c] hover:bg-[#fff0f2] rounded-lg transition-colors"
                          title="View details"
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
          <div className="px-5 py-3 border-t border-[#f0f0f0] flex items-center justify-between">
            <span className="text-sm text-[#929292]">
              {startIndex + 1}–{Math.min(startIndex + pageSize, sortedTransactions.length)} of {sortedTransactions.length}
            </span>
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
