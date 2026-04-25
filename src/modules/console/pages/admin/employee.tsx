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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
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
      return 'bg-[#e8f9f0] text-[#06c167]';
    case 'Suspended':
      return 'bg-[#fff8e6] text-[#c97a00]';
    default:
      return 'bg-[#f7f7f7] text-[#6a6a6a]';
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
        <div className="p-8 min-h-screen">
          <p className="text-[#6a6a6a]">No organization found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 min-h-screen">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#222222] tracking-tight mb-1">Employee Management</h1>
            <p className="text-[#6a6a6a] text-sm">Manage your team members and their account permissions.</p>
          </div>
          <Button
            onClick={openInvite}
            className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-[0.92] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Invite Employee
          </Button>
        </div>

        {/* Airbnb-style tabs — 2px bottom-border indicator */}
        <div className="flex gap-1 border-b border-[#dddddd] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('employee')}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors -mb-px ${
              activeTab === 'employee'
                ? 'border-[#222222] text-[#222222]'
                : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invitation')}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors -mb-px flex items-center gap-2 ${
              activeTab === 'invitation'
                ? 'border-[#222222] text-[#222222]'
                : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
            }`}
          >
            Invitation
            {pendingInvitations.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#fff0f2] text-[#ff385c] text-xs font-medium">
                {pendingInvitations.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'employee' && (
        <>
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292] pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by email"
                className="pl-9 border-[#dddddd] bg-white text-[#222222] placeholder:text-[#929292] focus-visible:ring-0 focus-visible:border-[#222222]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-[#dddddd] rounded-lg bg-white hover:border-[#222222] transition-colors"
              >
                <Filter className="w-4 h-4 text-[#6a6a6a]" />
                <span className="text-[#222222] font-medium">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-[#6a6a6a]" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#dddddd] rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] z-10 py-1.5">
                  {['All', 'Active', 'Suspended'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        statusFilter === status
                          ? 'text-[#ff385c] font-semibold bg-[#fff0f2]'
                          : 'text-[#222222] hover:bg-[#f7f7f7]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f7f7f7] border-b border-[#dddddd]">
                <tr>
                  {['Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Spinner className="mx-auto" />
                    </td>
                  </tr>
                ) : (
                  searchFiltered.map((member) => (
                    <tr key={member.membershipId} className="hover:bg-[#f7f7f7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-[#222222]">
                        {member.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#6a6a6a]">
                        {ROLE_LABEL[member.role] ?? member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#6a6a6a]">
                        {formatJoinedAt(member.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditEmployee(member.membershipId)}
                            className="p-2 text-[#929292] hover:text-[#ff385c] hover:bg-[#fff0f2] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(member)}
                            disabled={removeMember.isPending}
                            className="p-2 text-[#929292] hover:text-[#c13515] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
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
            <div className="px-6 py-4 border-t border-[#dddddd] flex items-center justify-between">
              <div className="text-sm text-[#6a6a6a]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} results
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'invitation' && (
          <>
            {!pendingLoading && pendingInvitations.length > 0 && (
              <div className="bg-white rounded-[14px] border border-[#dddddd] p-4 mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292] pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search by email"
                    className="pl-10 border-[#dddddd] bg-white text-[#222222] placeholder:text-[#929292] focus-visible:ring-0 focus-visible:border-[#222222]"
                    value={invitationSearchTerm}
                    onChange={(e) => setInvitationSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="bg-white rounded-[14px] border border-[#dddddd] overflow-hidden">
              {pendingLoading ? (
                <div className="py-12 flex justify-center">
                  <Spinner className="mx-auto" />
                </div>
              ) : pendingInvitations.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-[#929292]" />
                  </div>
                  <p className="text-sm font-semibold text-[#222222]">No pending invitations</p>
                  <p className="mt-1 text-sm text-[#6a6a6a]">
                    There are currently no active employee invitations.
                  </p>
                </div>
              ) : invitationFiltered.length === 0 ? (
                <div className="py-12 text-center text-[#6a6a6a] text-sm">
                  <p>No invitations match your search.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f7f7f7] border-b border-[#dddddd]">
                      <tr>
                        {['Email', 'Role', 'Status', 'Expires', 'Sent'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {invitationPaged.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#f7f7f7]">
                          <td className="px-6 py-4 whitespace-nowrap text-[#222222] font-medium">
                            {inv.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#6a6a6a]">
                            {ROLE_LABEL[inv.role] ?? inv.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                             <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#fff8e6] text-[#c97a00]">
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#6a6a6a]">
                            {formatJoinedAt(inv.expiredTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[#6a6a6a]">
                            {formatJoinedAt(inv.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {invitationTotalCount > PAGE_SIZE && (
                   <div className="px-6 py-4 border-t border-[#dddddd] flex items-center justify-between">
                     <div className="text-sm text-[#6a6a6a]">
                       Showing {(invitationPage - 1) * PAGE_SIZE + 1} to{' '}
                       {Math.min(invitationPage * PAGE_SIZE, invitationTotalCount)} of{' '}
                       {invitationTotalCount} results
                     </div>
                     <Pagination
                       currentPage={invitationPage}
                       totalPages={invitationTotalPages}
                       onPageChange={setInvitationPage}
                     />
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
