import { Layout } from '../../components/admin/layout';

export function EmployeePage() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
        <p className="text-gray-600">Manage your team members and their account permissions.</p>
        
        {/* Content will be added later */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Employee management content coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}

