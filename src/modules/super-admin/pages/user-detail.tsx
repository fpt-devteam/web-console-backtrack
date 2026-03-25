import { Layout } from '../components/layout';
import { useRouter, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { mockSuperAdminUsers, type QrPlanStatus } from '@/mock/data/mock-super-admin-users';
import { ArrowLeft, CheckCircle2, Calendar, Phone, Mail, User2 } from 'lucide-react';

export function UserDetailPage() {
  const router = useRouter();
  const { userId } = useParams({ from: '/super-admin/users/$userId' });
  const user = mockSuperAdminUsers.find((item) => item.id === userId);

  const handleBack = () => {
    router.navigate({ to: '/super-admin/users' });
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getUserStatusBadgeClass = (status: string) => {
    if (status === 'Active') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getQrPlanStatusColor = (status: QrPlanStatus) => {
    switch (status) {
      case 'Active':
        return 'text-green-600';
      case 'Payment Due':
        return 'text-orange-600';
      case 'Suspended':
        return 'text-red-600';
      case 'Expired':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">The requested user could not be found.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <button onClick={handleBack} className="hover:text-gray-700 cursor-pointer">
              User Management
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{user.name}</span>
          </nav>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Admin Data View:</strong> You are viewing user-level profile and QR service consumption to support account governance and plan monitoring.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUserStatusBadgeClass(user.status)}`}>
                {user.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">{user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">{user.organizationName || '—'}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <div className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <User2 className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">{user.department || '—'}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">{user.phone || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {user.qrPlan ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">CURRENT TIER</p>
                  <p className="text-xl font-bold text-gray-900">{user.qrPlan.tier}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 ${getQrPlanStatusColor(user.qrPlan.status)}`} />
                  <span className={`font-medium ${getQrPlanStatusColor(user.qrPlan.status)}`}>{user.qrPlan.status}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Renewal: {formatDate(user.qrPlan.renewalDate)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div>
                      Billing: <span className="font-medium text-gray-900">{user.qrPlan.billingCycle}</span>
                    </div>
                    <div>
                      Price: <span className="font-medium text-gray-900">${user.qrPlan.price.amount.toFixed(2)}</span>/{user.qrPlan.price.period}
                    </div>
                    <div>
                      Monthly QR Limit: <span className="font-medium text-gray-900">{user.qrPlan.quotas.monthlyQrLimit}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">{user.qrPlan.description}</p>
              </div>
            </div>
          ) : null}

          <div className="bg-white rounded-xl shadow-sm p-6">
            {user.billingHistory && user.billingHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[420px] w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 text-left text-blue-900 uppercase text-xs font-bold tracking-wider border-b-2 border-blue-200">
                      <th className="font-medium py-2 ps-2">Invoice</th>
                      <th className="font-medium py-2 ps-2">Date</th>
                      <th className="font-medium py-2 ps-2">Amount</th>
                      <th className="font-medium py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.billingHistory.slice(0, 6).map((invoice) => (
                      <tr key={invoice.id} className="border-t">
                        <td className="py-3 pr-4 text-gray-700">{invoice.id}</td>
                        <td className="py-3 pr-4 text-gray-700">{formatDate(invoice.invoiceDate)}</td>
                        <td className="py-3 pr-4 text-gray-700">
                          ${invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                        <td className="py-3 text-gray-700">{invoice.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No billing history available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

