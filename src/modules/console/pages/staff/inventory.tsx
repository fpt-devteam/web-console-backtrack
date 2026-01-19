import { StaffLayout } from '../../components/staff/layout'
import {
  Filter as FilterIcon,
  MoreVertical,
  Calendar,
  Download,
  Plus,
  X,
  MapPin,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import {
  mockInventoryItems,
  locations,
  categories,
  statuses,
  type ItemStatus,
} from '@/mock/data/mock-inventory'
import { Pagination } from '@/components/ui/pagination'
import { Link, useNavigate } from '@tanstack/react-router'
import { SearchFilter, Filter } from '@/components/filters'

export function StaffInventoryPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const totalItems = 124

  // Active filters
  const activeFilters = [
    { label: 'Location: Main Warehouse', value: 'location' },
    { label: 'Type: Electronics', value: 'category' },
  ]

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
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage lost and found items, storage, and disposal actions.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link to="/console/staff/inventory-add-item">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
              <Plus className="w-4 h-4" />
              Add found item
            </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <SearchFilter
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={() => {
                if (searchTerm.trim()) {
                  navigate({
                    to: '/console/staff/inventory-search',
                    search: { q: searchTerm.trim() },
                  })
                }
              }}
                placeholder="Search by ID or name..."
              />

            {/* Status Filter */}
            <Filter
              type="select"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statuses.map((s) => ({ value: s, label: s }))}
              label="Status"
            />

            {/* Category Filter */}
            <Filter
              type="select"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories
                .filter((c) => c !== 'All')
                .map((c) => ({ value: c, label: c }))}
              label="Category"
            />

            {/* Location Filter */}
            <Filter
              type="select"
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locations
                .filter((l) => l !== 'All')
                .map((l) => ({ value: l, label: l }))}
              label="Location"
            />

            {/* Date Range */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>

            {/* Filter Icon */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FilterIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* More Options */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">ACTIVE:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {filter.label}
                <button className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Clear all
            </button>
          </div>
        </div>

        {/* Item Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Select all</span>
          </div>
          <span className="text-sm text-gray-600">
            Showing 1-8 of 124 items
          </span>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockInventoryItems.map((item) => (
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
                <button className="w-full py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </StaffLayout>
  )
}

