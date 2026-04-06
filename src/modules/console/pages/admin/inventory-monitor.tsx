import { Layout } from '../../components/admin/layout';
import { Calendar, Download, Search, Archive } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { Link, useParams } from '@tanstack/react-router';
import { queryMockAdminInventory } from '@/modules/console/mocks/admin-inventory.mock';

const pageSize = 8;

/** Org admin inventory — UI aligned with staff; sample data, no API. Simple text filter, no semantic search. */
export function AdminInventoryMonitorPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { items, totalCount } = useMemo(
    () =>
      queryMockAdminInventory({
        page: currentPage,
        pageSize,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        searchTerm: searchTerm.trim() || undefined,
      }),
    [currentPage, pageSize, statusFilter, searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const formatPosted = useMemo(() => {
    return (iso: string) => {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return iso;
      }
    };
  }, []);

  const statusBadgeClass = (s: string) => {
    switch (s) {
      case 'InStorage':
        return 'bg-indigo-500 text-white';
      case 'Returned':
        return 'bg-green-500 text-white';
      case 'Disposed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case 'InStorage':
        return 'In Storage';
      case 'Returned':
        return 'Returned';
      case 'Disposed':
        return 'Disposed';
      default:
        return s;
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen mx-0 sm:mx-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Inventory Dashboard</h1>
            <p className="text-black mt-1 text-sm sm:text-base">
              Organization-wide view. Add or edit items from the staff workspace.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, description, location…"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-black font-medium"
          >
            <option value="All">All</option>
            <option value="InStorage">In Storage</option>
            <option value="Returned">Returned</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>

        <div className="flex justify-end mb-4">
          <span className="text-sm text-black whitespace-nowrap">
            {totalCount > 0
              ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} items`
              : 'No items'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-black text-lg">
                No items found{searchTerm.trim() ? ` matching "${searchTerm.trim()}"` : ''}
              </p>
              {(statusFilter !== 'All' || searchTerm.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-black hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {item.imageUrls?.[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black">No image</div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black mb-3">{item.itemName}</h3>
                  <p className="text-sm text-black mb-3 line-clamp-2">{item.description}</p>
                  <div className="space-y-2 text-sm text-black mb-4">
                    {item.storageLocation && (
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 flex-shrink-0 text-black" />
                        <span>{item.storageLocation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-black" />
                      <span>Added {formatPosted(item.createdAt)}</span>
                    </div>
                  </div>
                  <Link
                    to="/console/$slug/admin/inventory/$itemId"
                    params={{ slug, itemId: item.id }}
                  >
                    <button
                      type="button"
                      className="w-full py-1.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {totalCount > pageSize ? (
          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
