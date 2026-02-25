import { Layout } from '../../components/admin/layout';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations, useOrgMembers, useUpdateMemberRole } from '@/hooks/use-org';
import { showToast } from '@/lib/toast';
import { Spinner } from '@/components/ui/spinner';

const ROLE_OPTIONS = [
  { value: 'OrgAdmin', label: 'Admin' },
  { value: 'OrgStaff', label: 'Staff' },
];

export function EditEmployeePage() {
  const router = useRouter();
  const { employeeId: membershipId } = useParams({ from: '/console/admin/edit-employee/$employeeId' });

  const { data: user } = useCurrentUser();
  const { data: myOrgs = [] } = useMyOrganizations({ enabled: !!user });
  const orgId = myOrgs[0]?.orgId ?? null;
  const { data: membersData, isLoading } = useOrgMembers(orgId, 1, 100);
  const updateRole = useUpdateMemberRole();

  const member = membersData?.items.find((m) => m.membershipId === membershipId) ?? null;

  const [role, setRole] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !membershipId) return;
    if (!role.trim()) {
      setErrors({ role: 'Role is required' });
      return;
    }
    setErrors({});
    updateRole.mutate(
      { orgId, membershipId, role },
      {
        onSuccess: () => {
          showToast.success('Role updated successfully');
          router.navigate({ to: '/console/admin/employee' });
        },
        onError: (err) => {
          showToast.error(err instanceof Error ? err.message : 'Failed to update role');
        },
      }
    );
  };

  const handleCancel = () => {
    router.navigate({ to: '/console/admin/employee' });
  };

  if (!orgId && !isLoading) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen text-center">
          <p className="text-gray-600">No organization found.</p>
          <button onClick={handleCancel} className="mt-4 text-blue-600 hover:underline">
            Back to Employees
          </button>
        </div>
      </Layout>
    );
  }

  if (orgId && (isLoading || !membersData)) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Not Found</h2>
              <p className="text-gray-600 mb-6">The member you're looking for doesn't exist.</p>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Employees
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Employees</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Employee</h1>
            <p className="text-gray-600">Update role and permissions.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Employee Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={member.displayName ?? ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={member.email ?? ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a role</option>
                      {ROLE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <input
                      type="text"
                      value={member.status}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateRole.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {updateRole.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
