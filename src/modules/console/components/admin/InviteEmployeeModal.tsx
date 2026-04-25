import { AlertCircle, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { invitationService } from '@/services/invitation.service';
import { INVITATION_KEYS } from '@/hooks/use-invitation';
import { showToast } from '@/lib/toast';

const ROLE_OPTIONS = [
  { value: 'OrgAdmin', label: 'Admin' },
  { value: 'OrgStaff', label: 'Staff' },
];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function InviteEmployeeModal({
  orgId,
  membersEmailsLower,
  onInvited,
  onClose,
}: {
  orgId: string | null;
  membersEmailsLower: Set<string>;
  onInvited: (email: string) => void;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const createInvitation = useMutation({
    mutationFn: (payload: { orgId: string; email: string; role: string }) => invitationService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.pending(variables.orgId) });
    },
  });

  const [form, setForm] = useState({ email: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDupError, setShowDupError] = useState(false);

  const emailLower = form.email.trim().toLowerCase();
  const emailExists = emailLower ? membersEmailsLower.has(emailLower) : false;

  return (
    <>
      {showDupError && (
        <div className="mb-4 bg-[#fff0f2] border border-[#dddddd] rounded-[8px] p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#c13515] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#c13515]">Unable to invite user</h3>
            <p className="text-sm text-[#c13515] mt-1 opacity-80">
              This email is already associated with a member in this organization.
            </p>
          </div>
          <button type="button" onClick={() => setShowDupError(false)} className="text-[#c13515] opacity-60 hover:opacity-100">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newErrors: Record<string, string> = {};

          if (!form.email.trim()) newErrors.email = 'Email address is required';
          else if (!validateEmail(form.email)) newErrors.email = 'Please use a valid email address';
          if (!form.role) newErrors.role = 'Role is required';

          if (emailExists) {
            setShowDupError(true);
            return;
          }
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }
          if (!orgId) {
            showToast.error('No organization found');
            return;
          }

          createInvitation.mutate(
            { orgId, email: form.email.trim(), role: form.role },
            {
              onSuccess: () => {
                showToast.success(`Invitation sent to ${form.email}`);
                onInvited(form.email.trim());
                setForm({ email: '', role: '' });
                setErrors({});
                setShowDupError(false);
                onClose();
              },
              onError: (err) => {
                showToast.error(err instanceof Error ? err.message : 'Failed to send invitation');
              },
            }
          );
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-[#222222] mb-2">
            Email Address <span className="text-[#c13515]">*</span>
          </label>
          <input
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => {
              setForm((p) => ({ ...p, email: e.target.value }));
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              setShowDupError(false);
            }}
            className={`w-full px-4 py-2 text-sm border rounded-[8px] focus:outline-none focus:border-[#222222] ${
              errors.email || showDupError
                ? 'border-[#c13515] bg-[#fff0f2]'
                : 'border-[#dddddd]'
            }`}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-[#c13515]">{errors.email}</p>
          ) : (
            <p className="mt-2 text-sm text-[#929292]">An invitation email will be sent to this address.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#222222] mb-2">
            Role <span className="text-[#c13515]">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => {
              setForm((p) => ({ ...p, role: e.target.value }));
              if (errors.role) setErrors((p) => ({ ...p, role: '' }));
            }}
            className={`w-full px-4 py-2 text-sm border rounded-[8px] focus:outline-none focus:border-[#222222] ${
              errors.role ? 'border-[#c13515]' : 'border-[#dddddd]'
            }`}
          >
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-2 text-sm text-[#c13515]">{errors.role}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-[#dddddd] rounded-[8px] font-semibold text-[#222222] hover:bg-[#f7f7f7] active:scale-[0.92]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createInvitation.isPending || !orgId}
            className="px-4 py-2 text-sm bg-[#ff385c] text-white rounded-[8px] font-semibold hover:bg-[#e0324f] disabled:opacity-50 active:scale-[0.92]"
          >
            {createInvitation.isPending ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
      </form>
    </>
  );
}
