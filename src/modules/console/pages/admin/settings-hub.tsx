import { Layout } from '../../components/admin/layout';
import { Building2, Lock, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function SettingsHubPage() {
  return (
    <Layout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <div className="mx-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your organization and account security.</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/console/admin/setting/organization"
              className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Organization Information</h2>
                  <p className="text-sm text-gray-500">Company profile, contact details, workspace URL</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
            </Link>

            <Link
              to="/console/admin/setting/security"
              className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500">Change your password</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
