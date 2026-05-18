import { useEffect, useState } from 'react';
import { showToast } from '@/lib/toast';
import type { OrgMember } from '@/types/organization.types';
import { useUpdateMemberRole } from '@/hooks/use-org';

const ROLE_OPTIONS = [
  { value: 'OrgAdmin', label: 'Admin' },
  { value: 'OrgStaff', label: 'Staff' },
];

export function EditEmployeeModal({
  orgId,
  member,
  getStatusColor,
  onClose,
}: {
  orgId: string | null;
  member: OrgMember | null;
  getStatusColor: (status: string) => string;
  onClose: () => void;
}) {
  const updateRole = useUpdateMemberRole();
  const [role, setRole] = useState(member?.role ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRole(member?.role ?? '');
    setError(null);
  }, [member?.membershipId]);

  if (!member) {
    return <div className="text-sm text-[#222222]">Member not found.</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!orgId) return;
        if (!role.trim()) {
          setError('Role is required');
          return;
        }
        setError(null);
        updateRole.mutate(
          { orgId, membershipId: member.membershipId, role },
          {
            onSuccess: () => {
              showToast.success('Role updated successfully');
              onClose();
            },
            onError: (err) => {
              showToast.error(err instanceof Error ? err.message : 'Failed to update role');
            },
          }
        );
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[#222222] mb-2">Email</label>
          <input
            type="email"
            value={member.email ?? ''}
            readOnly
            className="w-full px-4 py-2 text-sm border border-[#dddddd] rounded-[8px] bg-[#f7f7f7] text-[#222222] cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#222222] mb-2">
            Role <span className="text-[#c13515]">*</span>
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full px-4 py-2 text-sm border rounded-[8px] focus:outline-none focus:border-[#222222] ${
              error ? 'border-[#c13515]' : 'border-[#dddddd]'
            }`}
          >
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-2 text-sm text-[#c13515]">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#222222] mb-2">Status</label>
          <div className="px-4 py-2 text-sm border border-[#dddddd] rounded-[8px] bg-[#f7f7f7] flex items-center justify-between">
            <span className="text-[#222222]">{member.status}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}>
              {member.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border border-[#dddddd] text-[#222222] rounded-[8px] hover:bg-[#f7f7f7] transition-colors active:scale-[0.92]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateRole.isPending || !orgId}
          className="px-4 py-2 text-sm bg-[#ff385c] text-white rounded-[8px] hover:bg-[#e0324f] disabled:opacity-50 transition-colors active:scale-[0.92]"
        >
          {updateRole.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
