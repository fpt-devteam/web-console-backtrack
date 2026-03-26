import { StaffLayout } from '../../components/staff/layout'
import { ChevronRight, Trash2, Info, Building2, Camera, Tag, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useInventoryItem, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { useCurrentOrgId } from '@/contexts/current-org.context'
import { InventoryDetailPanels } from '@/modules/console/components/inventory-detail-panels'

export function ItemDetailPage() {
  const { itemId } = useParams({ from: '/console/staff/item/$itemId' })
  const navigate = useNavigate()
  const { currentOrgId } = useCurrentOrgId()
  const [mainImage, setMainImage] = useState(0)
  const deleteItem = useDeleteInventoryItem(currentOrgId)

  const { data: item, isLoading } = useInventoryItem(currentOrgId, itemId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'InStorage':
        return 'bg-indigo-500 text-white'
      case 'Returned':
        return 'bg-green-500 text-white'
      case 'Disposed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'InStorage': return 'In Storage'
      case 'Returned': return 'Returned'
      case 'Disposed': return 'Disposed'
      default: return s
    }
  }

  if (isLoading) {
    return (
      <StaffLayout>
        <div className="p-8 min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </StaffLayout>
    )
  }

  if (!item) {
    return (
      <StaffLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
            <Link to="/console/staff/inventory">
              <Button>Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </StaffLayout>
    )
  }

  const images = item.imageUrls?.length ? item.imageUrls : []
  const mainImg = images[mainImage] ?? images[0]

  return (
    <StaffLayout>
      <div className="p-6 h-full overflow-y-auto mx-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/console/staff/inventory" className="hover:text-gray-900 transition-colors">
            Inventory
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{item.itemName}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.itemName}</h1>
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status)}`}>
                  {statusLabel(item.status)}
                </span>
              </div>
              <p className="text-gray-600">
                Added {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              {item.status !== 'Returned' && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    disabled={deleteItem.isPending}
                    onClick={() => {
                      if (
                        window.confirm('Are you sure you want to delete this item? This cannot be undone.')
                      ) {
                        deleteItem.mutate(item.id, {
                          onSuccess: () => navigate({ to: '/console/staff/inventory' }),
                          onError: (err) =>
                            alert(err instanceof Error ? err.message : 'Failed to delete item'),
                        })
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteItem.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Link to="/console/staff/item-edit/$itemId" params={{ itemId: item.id }}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                  </Link>
                  <Link to="/console/staff/item-handover/$itemId" params={{ itemId: item.id }}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Handover</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7">
            <div className="lg:col-span-3 p-6 border-r border-gray-200">
              <div className="relative h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {mainImg ? (
                  <img src={mainImg} alt={item.itemName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">No image</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === idx
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 py-6 px-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase mb-2">STATUS</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>{statusLabel(item.status)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2">STORED LOCATION</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>{item.storageLocation || '—'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase mb-2">LOGGED AT</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{new Date(item.loggedAt).toLocaleString()}</span>
                  </div>
                </div>

                {item.distinctiveMarks && (
                  <div>
                    <div className="text-xs font-semibold uppercase mb-2">DISTINCTIVE MARKS</div>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span>{item.distinctiveMarks}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold uppercase mb-2">Description</div>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        </div>

        <InventoryDetailPanels item={item} />
      </div>
    </StaffLayout>
  )
}

