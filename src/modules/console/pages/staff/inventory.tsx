import { StaffLayout, InventoryFilters } from '../../components/staff'
import {
  Calendar,
  Download,
  Plus,
  MapPin,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import {
  mockInventoryItems,
  type ItemStatus,
} from '@/mock/data/mock-inventory'
import { Pagination } from '@/components/ui/pagination'
import { Link, useNavigate } from '@tanstack/react-router'

export function StaffInventoryPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Apply filters
  const filteredItems = mockInventoryItems.filter((item) => {
    // Status filter
    if (selectedStatus !== 'All' && item.status !== selectedStatus) {
      return false
    }
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false
    }
    // Location filter
    if (selectedLocation !== 'All' && item.location !== selectedLocation) {
      return false
    }
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower)
      )
    }
    return true
  })


  // Pagination
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalItems = filteredItems.length

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500 text-white'
      case 'Storage':
        return 'bg-yellow-500 text-white'
      case 'Claimed':
        return 'bg-green-500 text-white'
      case 'Disposed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Electronics':
        return 'text-blue-600 bg-blue-50'
      case 'Clothing':
        return 'text-purple-600 bg-purple-50'
      case 'Personal Items':
        return 'text-green-600 bg-green-50'
      case 'Food & Drink':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <StaffLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen mx-0 sm:mx-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inventory Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage lost and found items, storage, and disposal actions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link to="/console/staff/inventory-add-item" className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm sm:text-base w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add found item</span>
              <span className="sm:hidden">Add Item</span>
            </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <InventoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onSearch={() => {
            if (searchTerm.trim()) {
              navigate({
                to: '/console/staff/inventory-search',
                search: { q: searchTerm.trim() },
              })
            }
          }}
          searchPlaceholder="Search by ID or name..."
        />

        {/* Item Count */}
        <div className="flex justify-end mb-4">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Showing {paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No items found</p>
              {(searchTerm || selectedStatus !== 'All' || selectedCategory !== 'All' || selectedLocation !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedStatus('All')
                    setSelectedCategory('All')
                    setSelectedLocation('All')
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />  
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getCategoryColor(item.category)}`}
                >
                  {item.category.toUpperCase()}
                </span>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {item.date}, {item.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>#{item.id}</span>
                  </div>
                </div>

                {/* Button */}
                <Link to="/console/staff/item/$itemId" params={{ itemId: item.id }}>
                  <button className="w-full py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </StaffLayout>
  )
}

