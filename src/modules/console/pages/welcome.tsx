import { Building2, ChevronRight } from 'lucide-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations } from '@/hooks/use-org';
import { Spinner } from '@/components/ui/spinner';

export function WelcomePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: orgs = [], isLoading: orgsLoading } = useMyOrganizations({ enabled: !!user });

  const handleOrganizationClick = () => {
    router.navigate({ to: '/console/admin/dashboard' });
  };

  const isLoading = userLoading || orgsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-base text-gray-600">
              Select an organization to continue or create a new one.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-4">
              YOUR ORGANIZATIONS
            </h2>

            {orgs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">
                You don&apos;t have any organization yet. Create one to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {orgs.map((org) => (
                  <button
                    key={org.orgId}
                    type="button"
                    onClick={handleOrganizationClick}
                    className="w-full bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 shadow-md hover:shadow-lg transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold mb-0.5">{org.name}</h3>
                          <p className="text-sm text-gray-500">{org.slug}.backtrack.com</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create New Organization Button */}
          <div className="mt-6">
            <Link
              to="/console/create-organization"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-base font-medium transition-all rounded-md flex items-center justify-center"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">+</span>
                Create New Organization
              </span>
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help finding your workspace?{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

