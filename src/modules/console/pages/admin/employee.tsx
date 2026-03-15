import { Layout } from '../../components/admin/layout';
import { Search, Filter, Plus, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations, useOrgMembers, useRemoveMember } from '@/hooks/use-org';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { usePendingInvitations } from '@/hooks/use-invitation';
import { showToast } from '@/lib/toast';
import { Spinner } from '@/components/ui/spinner';
import type { OrgMember } from '@/types/organization.types';

const PAGE_SIZE = 10;
const ROLE_LABEL: Record<string, string> = { OrgAdmin: 'Admin', OrgStaff: 'Staff' };

function formatJoinedAt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getAvatarInitials(m: OrgMember) {
  return m.email?.slice(0, 2).toUpperCase() ?? '?';
}

/** BE MembershipStatus: Active, Suspended */
function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700';
    case 'Suspended':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-blue-600',
  'bg-gray-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-pink-600',
];

export function EmployeePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { currentOrgId } = useCurrentOrgId();
  const { data: myOrgs = [] } = useMyOrganizations({ enabled: !!user });
  const orgId = currentOrgId ?? myOrgs[0]?.orgId ?? null;

  const [activeTab, setActiveTab] = useState<'employee' | 'invitation'>('employee');
  const [currentPage, setCurrentPage] = useState(1);
  const [invitationPage, setInvitationPage] = useState(1);
  const [invitationSearchTerm, setInvitationSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { data: membersData, isLoading } = useOrgMembers(orgId, currentPage, PAGE_SIZE);
  const removeMember = useRemoveMember();
  const { data: pendingData, isLoading: pendingLoading } = usePendingInvitations(orgId);
  const pendingInvitations = pendingData?.invitations ?? [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'invitation') setActiveTab('invitation');
    const status = params.get('status');
    if (status === 'Active' || status === 'Suspended') setStatusFilter(status);
  }, []);

  const items = membersData?.items ?? [];
  const totalCount = membersData?.totalCount ?? 0;
  const filteredItems =
    statusFilter === 'All'
      ? items
      : items.filter((m) => m.status === statusFilter);
  const searchFiltered =
    !searchTerm.trim()
      ? filteredItems
      : filteredItems.filter((m) => (m.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const invitationFiltered =
    !invitationSearchTerm.trim()
      ? pendingInvitations
      : pendingInvitations.filter(
          (inv) =>
            (inv.email ?? '')
              .toLowerCase()
              .includes(invitationSearchTerm.toLowerCase()) 
            
        );
  const invitationTotalCount = invitationFiltered.length;
  const invitationTotalPages = Math.max(1, Math.ceil(invitationTotalCount / PAGE_SIZE));
  const invitationPaged = invitationFiltered.slice(
    (invitationPage - 1) * PAGE_SIZE,
    invitationPage * PAGE_SIZE
  );

  useEffect(() => {
    if (invitationTotalPages > 0 && invitationPage > invitationTotalPages) {
      setInvitationPage(1);
    }
  }, [invitationPage, invitationTotalPages]);

  useEffect(() => {
    setInvitationPage(1);
  }, [invitationSearchTerm]);

  const handleEditEmployee = (membershipId: string) => {
    router.navigate({
      to: '/console/admin/edit-employee/$employeeId',
      params: { employeeId: membershipId },
    });
  };

  const handleDeleteEmployee = (member: OrgMember) => {
    if (!orgId) return;
    if (!window.confirm(`Are you sure you want to remove ${member.email || 'this member'}?`)) return;
    removeMember.mutate(
      { orgId, membershipId: member.membershipId },
      {
        onSuccess: () => showToast.success('Member removed'),
        onError: (err) => showToast.error(err instanceof Error ? err.message : 'Failed to remove member'),
      }
    );
  };

  if (!orgId && !isLoading) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <p className="text-gray-600">No organization found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
            <p className="text-gray-600">Manage your team members and their account permissions.</p>
          </div>
          <button
            onClick={() => router.navigate({ to: '/console/admin/invite-employee' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Invite Employee
          </button>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('employee')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors -mb-px ${
              activeTab === 'employee'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invitation')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors -mb-px ${
              activeTab === 'invitation'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Invitation
            {pendingInvitations.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                {pendingInvitations.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'employee' && (
        <>
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {['All', 'Active', 'Suspended'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                          statusFilter === status ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Spinner className="mx-auto" />
                    </td>
                  </tr>
                ) : (
                  searchFiltered.map((member, index) => (
                    <tr key={member.membershipId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              AVATAR_COLORS[index % AVATAR_COLORS.length]
                            } flex items-center justify-center text-white font-semibold text-sm`}
                          >
                            {getAvatarInitials(member)}
                          </div>
                          <span className="font-medium text-gray-900">{member.email || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {ROLE_LABEL[member.role] ?? member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatJoinedAt(member.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditEmployee(member.membershipId)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(member)}
                            disabled={removeMember.isPending}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && totalCount > 0 && totalCount > PAGE_SIZE && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'invitation' && (
          <>
            {!pendingLoading && pendingInvitations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={invitationSearchTerm}
                    onChange={(e) => setInvitationSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {pendingLoading ? (
                <div className="py-12 flex justify-center">
                  <Spinner className="mx-auto" />
                </div>
              ) : pendingInvitations.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>No pending invitations.</p>
                  <button
                    type="button"
                    onClick={() => router.navigate({ to: '/console/admin/invite-employee' })}
                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Send an invitation
                  </button>
                </div>
              ) : invitationFiltered.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>No invitations match your search.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Sent
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invitationPaged.map((inv) => (
                        <tr key={inv.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {inv.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {ROLE_LABEL[inv.role] ?? inv.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatJoinedAt(inv.expiredTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {formatJoinedAt(inv.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {invitationTotalCount > PAGE_SIZE && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(invitationPage - 1) * PAGE_SIZE + 1} to{' '}
                      {Math.min(invitationPage * PAGE_SIZE, invitationTotalCount)} of{' '}
                      {invitationTotalCount} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvitationPage((p) => Math.max(1, p - 1))}
                        disabled={invitationPage === 1}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setInvitationPage((p) => Math.min(invitationTotalPages, p + 1))
                        }
                        disabled={invitationPage >= invitationTotalPages}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
