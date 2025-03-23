import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash, MoreVertical, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock service data
const mockServices = [
  {
    id: 1,
    name: 'Website Development',
    category: 'Web Development',
    description: 'Custom website design and development services',
    price: 2499,
    recurring: false,
    status: 'active',
    clientCount: 15
  },
  {
    id: 2,
    name: 'SEO Package',
    category: 'Marketing',
    description: 'Search engine optimization to improve website visibility',
    price: 799,
    recurring: true,
    billingPeriod: 'monthly',
    status: 'active',
    clientCount: 24
  },
  {
    id: 3,
    name: 'Social Media Management',
    category: 'Marketing',
    description: 'Comprehensive social media management across platforms',
    price: 599,
    recurring: true,
    billingPeriod: 'monthly',
    status: 'active',
    clientCount: 18
  },
  {
    id: 4,
    name: 'Web Hosting',
    category: 'Hosting',
    description: 'Reliable and secure web hosting services',
    price: 49,
    recurring: true,
    billingPeriod: 'monthly',
    status: 'active',
    clientCount: 32
  },
  {
    id: 5,
    name: 'Email Marketing',
    category: 'Marketing',
    description: 'Email campaign management and analytics',
    price: 349,
    recurring: true,
    billingPeriod: 'monthly',
    status: 'inactive',
    clientCount: 7
  },
  {
    id: 6,
    name: 'Mobile App Development',
    category: 'App Development',
    description: 'Custom mobile application development for iOS and Android',
    price: 4999,
    recurring: false,
    status: 'active',
    clientCount: 5
  },
  {
    id: 7,
    name: 'AI Integration',
    category: 'Technology',
    description: 'Integrate AI and machine learning capabilities into existing systems',
    price: 1999,
    recurring: false,
    status: 'active',
    clientCount: 3
  }
];

interface ServicesManagementProps {
  theme: 'light' | 'dark';
}

const ServicesManagement: React.FC<ServicesManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter services based on search, category, and status
  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...mockServices
    .map(service => service.category)
    .filter((category, index, array) => array.indexOf(category) === index)
  ];

  // Get appropriate CSS class for service status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format price with billing period if applicable
  const formatPrice = (service: any) => {
    if (service.recurring) {
      return `$${service.price}/${service.billingPeriod.charAt(0)}`;
    }
    return `$${service.price}`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Services Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
            <Search className="h-4 w-4 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              className={`pl-9 pr-4 py-2 w-full sm:w-64 rounded-md focus:outline-none ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#182032] text-white'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center px-4 py-2 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-[#182032] border-[#2a3448] text-gray-200 hover:bg-[#1e2a45]'} border rounded-md`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {isFilterOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border`}>
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium">Category</div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left px-4 py-2 text-sm ${categoryFilter === category ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <div className="px-4 py-2 text-sm font-medium">Status</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'active' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'inactive' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('inactive')}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className={`flex items-center px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>
      
      <div className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#12192e]'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Service
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Category
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Price
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Clients
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
              {filteredServices.map((service) => (
                <tr key={service.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {service.name}
                    </div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {service.description.length > 60 
                        ? `${service.description.substring(0, 60)}...` 
                        : service.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {service.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {formatPrice(service)}
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {service.recurring ? 'Recurring' : 'One-time'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {service.clientCount} clients
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/dashboard/admin/service-management/${service.id}`}
                        className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-[#253552] text-gray-300'}`}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                      <button className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-[#253552] text-gray-300'}`}>
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-red-500' : 'hover:bg-[#253552] text-red-400'}`}>
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className={`py-10 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            No services found. Try adjusting your search or filters.
          </div>
        )}
      </div>
      
      <div className="mt-5 flex justify-between items-center">
        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Showing {filteredServices.length} of {mockServices.length} services
        </div>
        
        <div className="flex">
          <button
            className={`px-3 py-1 rounded-l-md border ${theme === 'light' ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-[#182032] border-[#2a3448] text-gray-300 hover:bg-[#1e2a45]'}`}
            disabled={true}
          >
            Previous
          </button>
          <button
            className={`px-3 py-1 rounded-r-md border-t border-b border-r ${theme === 'light' ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-[#182032] border-[#2a3448] text-gray-300 hover:bg-[#1e2a45]'}`}
            disabled={true}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;
