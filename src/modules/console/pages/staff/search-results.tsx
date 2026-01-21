import { StaffLayout } from '../../components/staff/layout'
import {
  Calendar,
  MapPin,
  Package,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import {
  mockInventoryItems,
  locations,
  categories,
  type ItemStatus,
} from '@/mock/data/mock-inventory'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Pagination } from '@/components/ui/pagination'
import { SearchFilter, Filter } from '@/components/filters'

export interface SearchResultsSearch {
  q?: string
  category?: string
  location?: string
  date?: string
  page?: number
}

export function SearchResultsPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as SearchResultsSearch
  const [searchTerm, setSearchTerm] = useState(searchParams?.q || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.category || 'All')
  const [selectedLocation, setSelectedLocation] = useState(searchParams?.location || 'All')
  const [selectedDate, setSelectedDate] = useState(searchParams?.date || 'Last 30 Days')
  const [currentPage, setCurrentPage] = useState(searchParams?.page || 1)
  const itemsPerPage = 10
  const totalItems = 42

  // Mock search results with match percentages
  const searchResults = [
    {
      ...mockInventoryItems[0],
      matchPercentage: 92,
      matchDescription: 'High visual similarity detected',
      foundLocation: 'Found in Main Lobby, near Elevator B',
      storageLocation: 'Lobby Storage Box #4',
    },
    {
      ...mockInventoryItems[1],
      matchPercentage: 78,
      matchDescription: 'Color matches, shape varies',
      foundLocation: 'Found in East Wing, Corridor 2',
      storageLocation: 'Lost & Found Central',
    },
    {
      ...mockInventoryItems[2],
      matchPercentage: 45,
      matchDescription: 'Keywords match, visual mismatch',
      foundLocation: 'Found in Gym Locker Room',
      storageLocation: 'Front Desk',
    },
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

  const handleSearch = () => {
    navigate({
      to: '/console/staff/inventory-search',
      search: {
        q: searchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        location: selectedLocation !== 'All' ? selectedLocation : undefined,
        date: selectedDate,
      },
    })
  }

  const clearSearch = () => {
    setSearchTerm('')
    navigate({
      to: '/console/staff/inventory-search',
      search: {
        q: '',
      },
    })
  }

  const filteredCategories = categories.filter((cat) => cat !== 'All')
  const filteredLocations = locations.filter((loc) => loc !== 'All')
  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']

  return (
    <StaffLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/console/staff/inventory"
              className="hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to="/console/staff/inventory"
              className="hover:text-gray-900 transition-colors"
            >
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Search Results</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-4">
              <SearchFilter
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                onClear={clearSearch}
                placeholder="Search by ID or name..."
                showClearButton={true}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <Filter
                type="select"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={filteredCategories.map((c) => ({ value: c, label: c }))}
                label="Category"
              />

              <Filter
                type="select"
                value={selectedLocation}
                onChange={setSelectedLocation}
                options={filteredLocations.map((l) => ({ value: l, label: l }))}
                label="Location"
              />

              <Filter
                type="select"
                value={selectedDate}
                onChange={setSelectedDate}
                options={dateOptions.map((d) => ({ value: d, label: d }))}
                label="Date"
              />

              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Advanced Filters
              </button>

              <div className="ml-auto">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Sort by: Relevance (Score)</option>
                  <option>Sort by: Date (Newest)</option>
                  <option>Sort by: Date (Oldest)</option>
                  <option>Sort by: Match % (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </div>
          </div>

          {/* Search Results List */}
          <div className="space-y-4 mb-6">
            {searchResults.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}
                          >
                            {item.category.toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {item.matchPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {item.matchDescription}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.foundLocation || item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {item.date}, {item.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{item.storageLocation || item.bin || `Item #${item.id}`}</span>
                      </div>
                    </div>

                    <Link to="/console/staff/item/$itemId" params={{ itemId: item.id }}>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                        View Details
                      </button>
                    </Link>
                  </div>
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
      </div>
    </StaffLayout>
  )
}

