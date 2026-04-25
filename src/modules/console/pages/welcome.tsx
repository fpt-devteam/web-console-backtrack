import { ChevronRight } from 'lucide-react';
import { OrgLogo } from '@/components/org-logo';
import { Link, useRouter } from '@tanstack/react-router';
import { useCurrentUser } from '@/hooks/use-auth';
import { useMyOrganizations } from '@/hooks/use-org';
import { Spinner } from '@/components/ui/spinner';
import type { MyOrganization } from '@/types/organization.types';

export function WelcomePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: orgs = [], isLoading: orgsLoading } = useMyOrganizations({ enabled: !!user });

  const handleOrganizationClick = (org: MyOrganization) => {
    const destination = org.myRole === 'OrgAdmin'
      ? `/console/${org.slug}/admin/dashboard`
      : `/console/${org.slug}/staff/inventory`;
    router.navigate({ to: destination });
  };

  const isLoading = userLoading || orgsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    // Airbnb welcome: white canvas, max-width centered, zero decoration
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card: white, 14px radius, 1px Hairline Gray border */}
        <div className="bg-white rounded-[14px] border border-[#dddddd] p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#222222] tracking-tight mb-2">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-sm text-[#6a6a6a]">
              Select an organization to continue or create a new one.
            </p>
          </div>

          {/* Org list */}
          <div>
            <p className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider mb-3">
              Your Organizations
            </p>

            {orgs.length === 0 ? (
              <p className="text-sm text-[#6a6a6a] py-4">
                You don't have any organization yet. Create one to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {orgs.map((org) => (
                  <button
                    key={org.orgId}
                    type="button"
                    onClick={() => handleOrganizationClick(org)}
                    className="w-full bg-white border border-[#dddddd] rounded-xl p-4 hover:border-[#222222] active:scale-[0.98] transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OrgLogo
                          logoUrl={org.logoUrl}
                          alt={org.name}
                          className="h-10 w-10"
                          iconClassName="h-5 w-5"
                          rounded="lg"
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-[#222222] leading-tight">{org.name}</h3>
                          <p className="text-xs text-[#6a6a6a] mt-0.5">{org.slug}.backtrack.com</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#929292] group-hover:text-[#222222] transition-colors shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create New Organization — Rausch primary CTA */}
          <div className="mt-6">
            <Link
              to="/console/create-organization"
              className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-[0.97] text-white py-3 text-sm font-medium transition-all rounded-lg flex items-center justify-center gap-2"
            >
              <span className="text-base leading-none">+</span>
              Create New Organization
            </Link>
          </div>

          {/* Support link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#6a6a6a]">
              Need help finding your workspace?{' '}
              <a href="#" className="text-[#222222] font-medium underline hover:text-[#ff385c] transition-colors">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
