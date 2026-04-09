import { Layout } from '../../components/admin/layout';
import { Search, Filter, Plus, ChevronDown, Edit, Trash2, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations, useOrgMembers, useRemoveMember } from '@/hooks/use-org';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { usePendingInvitations } from '@/hooks/use-invitation';
import { useDebouncedValue, SEARCH_DEBOUNCE_MS } from '@/hooks/use-debounce';
import { showToast } from '@/lib/toast';
import { Spinner } from '@/components/ui/spinner';
import { AdminModal } from '@/modules/console/components/admin/AdminModal';
import { InviteEmployeeModal } from '@/modules/console/components/admin/InviteEmployeeModal';
import { EditEmployeeModal } from '@/modules/console/components/admin/EditEmployeeModal';
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

/** BE MembershipStatus: Active, Suspended */
function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Suspended':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

type ModalState =
  | { type: 'closed' }
  | { type: 'invite' }
  | { type: 'edit'; membershipId: string };


export function EmployeePage() {
  const navigate = useNavigate({ from: '/console/$slug/admin/employee' });
  const search = useSearch({ from: '/console/$slug/admin/employee' });
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
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });

  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const debouncedInvitationSearchTerm = useDebouncedValue(invitationSearchTerm.trim(), SEARCH_DEBOUNCE_MS);

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

  useEffect(() => {
    if (search?.modal === 'invite') {
      setModal({ type: 'invite' });
      return;
    }
    if (search?.modal === 'edit' && search?.membershipId) {
      setModal({ type: 'edit', membershipId: search.membershipId });
      return;
    }
    setModal({ type: 'closed' });
  }, [search?.modal, search?.membershipId]);

  const items = membersData?.items ?? [];
  const totalCount = membersData?.totalCount ?? 0;
  const filteredItems =
    statusFilter === 'All'
      ? items
      : items.filter((m) => m.status === statusFilter);
  const searchFiltered =
    !debouncedSearchTerm
      ? filteredItems
      : filteredItems.filter((m) => (m.email ?? '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const invitationFiltered =
    !debouncedInvitationSearchTerm
      ? pendingInvitations
      : pendingInvitations.filter(
          (inv) =>
            (inv.email ?? '')
              .toLowerCase()
              .includes(debouncedInvitationSearchTerm.toLowerCase())
        );
  const invitationTotalCount = invitationFiltered.length;
  const invitationTotalPages = Math.max(1, Math.ceil(invitationTotalCount / PAGE_SIZE));
  const invitationPaged = invitationFiltered.slice(
    (invitationPage - 1) * PAGE_SIZE,
    invitationPage * PAGE_SIZE
  );

  const membersAll = membersData?.items ?? [];
  const membersEmailsLower = new Set(membersAll.map((m) => (m.email ?? '').toLowerCase()));

  const openInvite = () => {
    navigate({
      search: (prev) => ({ ...prev, modal: 'invite', membershipId: undefined }),
      replace: true,
    });
  };

  const openEdit = (membershipId: string) => {
    navigate({
      search: (prev) => ({ ...prev, modal: 'edit', membershipId }),
      replace: true,
    });
  };

  const closeModal = () => {
    navigate({
      search: (prev) => ({ ...prev, modal: undefined, membershipId: undefined }),
      replace: true,
    });
  };

  useEffect(() => {
    if (invitationTotalPages > 0 && invitationPage > invitationTotalPages) {
      setInvitationPage(1);
    }
  }, [invitationPage, invitationTotalPages]);

  useEffect(() => {
    setInvitationPage(1);
  }, [debouncedInvitationSearchTerm]);

  const handleEditEmployee = (membershipId: string) => {
    openEdit(membershipId);
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
            onClick={openInvite}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
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
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email"
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {['All', 'Active', 'Suspended'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
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
            <table className="w-full text-sm text-black">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-black font-normal">
                      <Spinner className="mx-auto" />
                    </td>
                  </tr>
                ) : (
                  searchFiltered.map((member) => (
                    <tr key={member.membershipId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-black font-normal">
                        {member.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black font-normal">
                        {ROLE_LABEL[member.role] ?? member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusColor(member.status)}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black font-normal">
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
            <div className="px-6 py-4 border-t border-gray-300 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="py-14 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Mail className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-base font-semibold text-gray-900">Manage pending invitations.</p>
                  <p className="mt-1 text-sm text-gray-600">
                    There are currently no active employee invitations.
                  </p>
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

      <AdminModal open={modal.type === 'invite'} title="Invite Employee" onClose={closeModal}>
        <InviteEmployeeModal
          orgId={orgId}
          membersEmailsLower={membersEmailsLower}
          onInvited={() => {
            setActiveTab('invitation');
            navigate({ search: (prev) => ({ ...prev, tab: 'invitation' }), replace: true });
          }}
          onClose={closeModal}
        />
      </AdminModal>

      <AdminModal open={modal.type === 'edit'} title="Edit Employee" onClose={closeModal}>
        <EditEmployeeModal
          orgId={orgId}
          member={
            modal.type === 'edit'
              ? items.find((m) => m.membershipId === modal.membershipId) ??
                membersAll.find((m) => m.membershipId === modal.membershipId) ??
                null
              : null
          }
          getStatusColor={getStatusColor}
          onClose={closeModal}
        />
      </AdminModal>
    </Layout>
  );
}
