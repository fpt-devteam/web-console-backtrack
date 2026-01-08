import { Building2, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function WelcomePage() {
  // Hardcoded single organization for enterprise admin
  const organization = {
    name: 'Backtrack Inc.',
    domain: 'backtrackinc.portal.com',
    icon: Building2,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FF] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Welcome back, Sarah
            </h1>
            <p className="text-base text-gray-600">
              Select an organization to continue or create a new one.
            </p>
          </div>

          {/* Organizations Section */}
          <div className="mt-10">
            <h2 className="text-xs font-semibold  uppercase tracking-wide mb-4">
              YOUR ORGANIZATIONS
            </h2>

            {/* Single Organization Card */}
            <button
              className="w-full bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 shadow-md hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${organization.color} rounded-lg flex items-center justify-center`}>
                    <organization.icon className={`w-6 h-6 ${organization.iconColor}`} />
                  </div>
                  
                  {/* Organization Info */}
                  <div className="text-left">
                    <h3 className="text-base font-semibold mb-0.5">
                      {organization.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {organization.domain}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
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

