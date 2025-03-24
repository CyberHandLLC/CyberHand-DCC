import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader
} from 'lucide-react';

// Import shared components
import StatusBadge from '../../../../../components/ui/StatusBadge';
import TabNavigation from '../../../../../components/ui/TabNavigation';
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';

// Import hooks and API
import useApiError from '../../../../../hooks/useApiError';
import adminServiceAPI from '../../../../../api/services/adminServiceAPI';

// Import types and format utilities
import { Service } from '../../../../../types/service';

interface ServicesManagementProps {
  categoryId?: string;
}

const ServicesManagement: React.FC<ServicesManagementProps> = ({ categoryId }) => {
  const [activeServiceTab, setActiveServiceTab] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Services"]);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch services and categories when component mounts
  useEffect(() => {
    fetchServices();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch services based on active tab
  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeServiceTab]);
  
  // Fetch all services or services by category
  const fetchServices = async () => {
    try {
      if (activeServiceTab === "All Services") {
        const response = await handleApiCall(
          adminServiceAPI.getAllServices(),
          { context: 'Fetching all services' }
        );
        
        if (response?.data) {
          setServices(response.data);
        }
      } else {
        const response = await handleApiCall(
          adminServiceAPI.getServicesByCategory(activeServiceTab),
          { context: `Fetching ${activeServiceTab} services` }
        );
        
        if (response?.data) {
          setServices(response.data);
        }
      }
    } catch (err) {
      // Error is already handled by useApiError
      console.error('Error fetching services:', err);
    }
  };
  
  // Fetch service categories
  const fetchCategories = async () => {
    try {
      const response = await handleApiCall(
        adminServiceAPI.getServiceCategories(),
        { context: 'Fetching service categories' }
      );
      
      if (response?.data) {
        setCategories(["All Services", ...response.data]);
      }
    } catch (err) {
      // Error is already handled by useApiError
      console.error('Error fetching categories:', err);
    }
  };
  
  // Filter services based on search query
  const getFilteredServices = () => {
    let filtered = [...services];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }
    
    // Sort the data
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof Service];
        const bValue = b[sortColumn as keyof Service];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }
    
    return filtered;
  };
  
  const filteredServices = getFilteredServices();
  
  // Toggle sort when clicking a column header
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return (
      <ArrowUpDown className={`ml-1 h-4 w-4 inline ${
        sortDirection === 'asc' ? 'transform rotate-180' : ''
      }`} />
    );
  };
  
  // Format price with billing period
  const formatPrice = (service: Service) => {
    if (service.recurring && service.billingPeriod) {
      const periodMap: Record<string, string> = {
        'monthly': 'mo',
        'quarterly': 'qtr',
        'yearly': 'yr',
        'one-time': 'one-time'
      };
      
      return `$${service.price}/${periodMap[service.billingPeriod]}`;
    }
    
    return `$${service.price}`;
  };

  // Handle service delete
  const handleDeleteService = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await handleApiCall(
        adminServiceAPI.deleteService(id),
        { context: 'Deleting service' }
      );
      
      // Refresh services after delete
      fetchServices();
    }
  };

  return (
    <div className="space-y-4">
      {/* Services Management Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Services Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create, manage and monitor service offerings
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              
              <button className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Services tabs for desktop */}
        <div className="mt-4 hidden md:block">
          <TabNavigation
            tabs={categories}
            activeTab={activeServiceTab}
            onTabChange={setActiveServiceTab}
          />
        </div>
        
        {/* Services tabs for mobile with arrows */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md dark:bg-gray-700">
            <button 
              onClick={() => {
                const currentIndex = categories.indexOf(activeServiceTab);
                if (currentIndex > 0) {
                  setActiveServiceTab(categories[currentIndex - 1]);
                }
              }}
              disabled={categories.indexOf(activeServiceTab) === 0}
              className={`p-1.5 rounded-md ${
                categories.indexOf(activeServiceTab) === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } bg-gray-200 dark:bg-gray-600`}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            
            <span className="font-medium text-xs px-2 py-1 rounded-md text-center min-w-[120px] bg-white dark:bg-gray-800">
              {activeServiceTab}
            </span>
            
            <button 
              onClick={() => {
                const currentIndex = categories.indexOf(activeServiceTab);
                if (currentIndex < categories.length - 1) {
                  setActiveServiceTab(categories[currentIndex + 1]);
                }
              }}
              disabled={categories.indexOf(activeServiceTab) === categories.length - 1}
              className={`p-1.5 rounded-md ${
                categories.indexOf(activeServiceTab) === categories.length - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } bg-gray-200 dark:bg-gray-600`}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError}
          className="mb-4"
        />
      )}
      
      {/* Services list */}
      <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading services...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No services found matching your criteria.</p>
            {error && (
              <button
                onClick={fetchServices}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile view - card layout */}
            <div className="md:hidden space-y-4">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">{service.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.category}</p>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Price:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatPrice(service)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Clients:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{service.clientCount}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                    <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-gray-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop view - table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <span className="flex items-center">
                        Service Name {renderSortIndicator('name')}
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort('category')}
                    >
                      <span className="flex items-center">
                        Category {renderSortIndicator('category')}
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <span className="flex items-center">
                        Price {renderSortIndicator('price')}
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort('clientCount')}
                    >
                      <span className="flex items-center">
                        Clients {renderSortIndicator('clientCount')}
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(service)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service.clientCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;
