import { Layout } from '../../components/admin/layout';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations, useOrgMembers } from '@/hooks/use-org';
import { useCurrentOrgId } from '@/contexts/current-org.context';
import { invitationService } from '@/services/invitation.service';
import { showToast } from '@/lib/toast';

const ROLE_OPTIONS = [
  { value: 'OrgAdmin', label: 'Admin' },
  { value: 'OrgStaff', label: 'Staff' },
];

export function InviteEmployeePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { currentOrgId } = useCurrentOrgId();
  const { data: myOrgs = [] } = useMyOrganizations({ enabled: !!user });
  const orgId = currentOrgId ?? myOrgs[0]?.orgId ?? null;
  const { data: membersData } = useOrgMembers(orgId, 1, 500);

  const [formData, setFormData] = useState({ fullName: '', email: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showError, setShowError] = useState(false);

  const createInvitation = useMutation({
    mutationFn: (payload: { orgId: string; email: string; role: string }) =>
      invitationService.create(payload),
  });

  const members = membersData?.items ?? [];
  const emailExists = (email: string) =>
    members.some((m) => (m.email ?? '').toLowerCase() === email.trim().toLowerCase());

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setShowError(false);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please use a valid email address';
    if (!formData.role) newErrors.role = 'Role is required';

    if (emailExists(formData.email)) {
      setShowError(true);
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
      { orgId, email: formData.email.trim(), role: formData.role },
      {
        onSuccess: () => {
          showToast.success(`Invitation sent to ${formData.email}`);
          router.navigate({ to: '/console/admin/employee', search: { status: 'Invited' } });
        },
        onError: (err) => {
          showToast.error(err instanceof Error ? err.message : 'Failed to send invitation');
        },
      }
    );
  };

  const handleCancel = () => router.navigate({ to: '/console/admin/employee' });

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Employee</h1>
            <p className="text-gray-600">
              Add a new member to your organization. They will receive an email to activate their account.
            </p>
          </div>

          {showError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Unable to invite user</h3>
                <p className="text-sm text-red-700 mt-1">
                  This email is already associated with a member in this organization.
                </p>
              </div>
              <button onClick={() => setShowError(false)} className="text-red-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email || showError
                      ? 'border-red-300 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                {!errors.email && (
                  <p className="mt-2 text-sm text-gray-500">
                    An invitation email will be sent to this address.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-1.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createInvitation.isPending || !orgId}
                  className="px-6 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {createInvitation.isPending ? 'Sending…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
