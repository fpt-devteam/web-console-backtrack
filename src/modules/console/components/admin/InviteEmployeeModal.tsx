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
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800">Unable to invite user</h3>
            <p className="text-sm text-red-700 mt-1">
              This email is already associated with a member in this organization.
            </p>
          </div>
          <button type="button" onClick={() => setShowDupError(false)} className="text-red-400 hover:text-red-600">
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
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
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email || showDupError
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">An invitation email will be sent to this address.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => {
              setForm((p) => ({ ...p, role: e.target.value }));
              if (errors.role) setErrors((p) => ({ ...p, role: '' }));
            }}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createInvitation.isPending || !orgId}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {createInvitation.isPending ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
      </form>
    </>
  );
}

