import { Layout } from '../../components/admin/layout';
import { InventoryDetailMockPanels } from '../../components/inventory-detail-mock-panels';
import { ChevronRight, Info, Building2, Tag, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { getMockAdminInventoryById } from '@/modules/console/mocks/admin-inventory.mock';

/** Org admin inventory detail — sample data, no API. */
export function AdminInventoryItemDetailPage() {
  const { slug, itemId } = useParams({ from: '/console/$slug/admin/inventory/$itemId' });
  const [mainImage, setMainImage] = useState(0);

  const item = useMemo(() => getMockAdminInventoryById(itemId), [itemId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'InStorage':
        return 'bg-indigo-500 text-white';
      case 'Returned':
        return 'bg-green-500 text-white';
      case 'Disposed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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

  if (!item) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-black mb-2">Item not found</h2>
            <p className="text-black mb-6">No item found for this ID.</p>
            <Link
              to="/console/$slug/admin/inventory"
              params={{ slug }}
              className="text-black font-medium underline hover:no-underline"
            >
              Back to inventory
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = item.imageUrls?.length ? item.imageUrls : [];
  const mainImg = images[mainImage] ?? images[0];

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2 text-sm text-black">
          <Link
            to="/console/$slug/admin/inventory"
            params={{ slug }}
            className="hover:underline transition-colors"
          >
            Inventory
          </Link>
          <ChevronRight className="w-4 h-4 text-black" />
          <span className="text-black font-medium truncate">{item.itemName}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">{item.itemName}</h1>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status)}`}>
                {statusLabel(item.status)}
              </span>
            </div>
            <p className="text-sm text-black">
              Added{' '}
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              · <span className="font-medium text-red-600">View only</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7">
            <div className="lg:col-span-3 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="relative h-[280px] sm:h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {mainImg ? (
                  <img src={mainImg} alt={item.itemName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-black">No image</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMainImage(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === idx
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 py-6 px-6 sm:px-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase mb-2 text-black">Status</div>
                  <div className="flex items-center gap-2 text-black">
                    <Info className="w-4 h-4 text-black" />
                    <span>{statusLabel(item.status)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2 text-black">Stored location</div>
                  <div className="flex items-center gap-2 text-black">
                    <Building2 className="w-4 h-4 text-black" />
                    <span>{item.storageLocation || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2 text-black">Logged at</div>
                  <div className="flex items-center gap-2 text-black">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>{new Date(item.loggedAt).toLocaleString()}</span>
                  </div>
                </div>

                {item.distinctiveMarks ? (
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2 text-black">Distinctive marks</div>
                    <div className="flex items-center gap-2 text-black">
                      <Tag className="w-4 h-4 text-black" />
                      <span>{item.distinctiveMarks}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <div className="text-xs font-semibold uppercase mb-2 text-black">Description</div>
                <p className="text-black leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        </div>

        <InventoryDetailMockPanels />
      </div>
    </Layout>
  );
}
