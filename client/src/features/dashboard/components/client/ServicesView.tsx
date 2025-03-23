import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { ArrowUpRight, Check, AlertTriangle } from 'lucide-react';

interface ServicesViewProps {
  theme?: 'light' | 'dark';
}

// Mock services data
const services = [
  { 
    id: 1, 
    name: "Website Maintenance", 
    description: "Monthly maintenance of your website including security updates, content updates, and performance optimization.",
    status: "active", 
    nextBilling: "2025-04-15", 
    amount: 299,
    features: [
      "Weekly backups",
      "Security monitoring",
      "Content updates (up to 4 hrs/month)",
      "Performance optimization",
      "Monthly reports"
    ]
  },
  { 
    id: 2, 
    name: "Social Media Management", 
    description: "Managing your social media accounts with regular posts, engagement, and analytics reports.",
    status: "active", 
    nextBilling: "2025-04-10", 
    amount: 199,
    features: [
      "3 posts per week",
      "Community engagement",
      "Performance analytics",
      "Content calendar",
      "Monthly strategy updates"
    ]
  },
  { 
    id: 3, 
    name: "Email Marketing", 
    description: "Email campaign management including design, sending, and analytics reporting.",
    status: "pending", 
    nextBilling: "2025-04-20", 
    amount: 99,
    features: [
      "1 campaign per month",
      "Email template design",
      "List management",
      "A/B testing",
      "Performance analytics"
    ]
  },
  { 
    id: 4, 
    name: "SEO Services", 
    description: "Search engine optimization to improve your website's visibility in search results.",
    status: "inactive", 
    nextBilling: null, 
    amount: 399,
    features: [
      "Keyword research",
      "On-page optimization",
      "Content strategy",
      "Backlink building",
      "Monthly reporting"
    ]
  }
];

// Available add-ons
const addOns = [
  {
    id: 1,
    name: "Advanced Analytics",
    description: "Get deeper insights with advanced analytics and custom reports.",
    price: 49,
    compatible: [1, 2, 3]
  },
  {
    id: 2,
    name: "Priority Support",
    description: "Get priority support with 4-hour response time guarantee.",
    price: 39,
    compatible: [1, 2, 3, 4]
  },
  {
    id: 3,
    name: "Additional Content Updates",
    description: "Additional 4 hours of content updates per month.",
    price: 99,
    compatible: [1]
  }
];

const ServicesView: React.FC<ServicesViewProps> = ({ theme = 'dark' }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      case "pending":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 bg-opacity-40 text-yellow-300';
      case "inactive":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };

  // Filter services based on the selected filter
  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(service => service.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2 className={`text-xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Your Services
        </h2>
        
        {/* Filter options */}
        <div className={`inline-flex p-1 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'} rounded-md`}>
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'all' 
                ? `bg-teal-500 text-white` 
                : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#1e2a45]'}`
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'active' 
                ? `bg-teal-500 text-white` 
                : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#1e2a45]'}`
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'pending' 
                ? `bg-teal-500 text-white` 
                : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#1e2a45]'}`
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('inactive')} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === 'inactive' 
                ? `bg-teal-500 text-white` 
                : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#1e2a45]'}`
            }`}
          >
            Inactive
          </button>
        </div>
      </div>
      
      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg overflow-hidden`}
            >
              <div className={`p-5 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-[#2a3448]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {service.name}
                    </h3>
                    <p className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {service.description}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                
                {/* Service details */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Monthly fee
                    </p>
                    <p className={`mt-1 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {formatCurrency(service.amount)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Next billing
                    </p>
                    <p className={`mt-1 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {formatDate(service.nextBilling)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Service features */}
              <div className="p-5">
                <h4 className={`text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Included features:
                </h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`h-4 w-4 mt-0.5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Actions */}
              <div className={`p-4 ${theme === 'light' ? 'bg-gray-50 border-t border-gray-200' : 'bg-[#1a2537] border-t border-[#2a3448]'}`}>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/dashboard/client/services/${service.id}`} 
                    className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
                  >
                    View details
                  </Link>
                  
                  {service.status === 'active' && (
                    <button 
                      className={`text-sm font-medium px-3 py-1.5 rounded-md ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#182032] border border-[#2a3448] text-gray-300 hover:bg-[#1e2a45]'}`}
                    >
                      Manage service
                    </button>
                  )}
                  
                  {service.status === 'inactive' && (
                    <button 
                      className="text-sm font-medium px-3 py-1.5 rounded-md bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Activate now
                    </button>
                  )}
                  
                  {service.status === 'pending' && (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mr-1.5" />
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        Awaiting approval
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-8 text-center ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg`}>
          <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            No {filter !== 'all' ? filter : ''} services found
          </p>
          <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            {filter !== 'all' 
              ? `You don't have any ${filter} services. Try changing the filter or contact support.`
              : `You don't have any services yet. Please contact your account manager to get started.`
            }
          </p>
        </div>
      )}
      
      {/* Add-ons section */}
      <div className="mt-10">
        <h2 className={`text-xl font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Recommended Add-ons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {addOns.map(addon => (
            <div 
              key={addon.id} 
              className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg overflow-hidden`}
            >
              <div className="p-5">
                <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {addon.name}
                </h3>
                <p className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {addon.description}
                </p>
                <p className={`mt-3 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formatCurrency(addon.price)}/month
                </p>
                
                <button 
                  className="mt-4 w-full flex items-center justify-center text-sm font-medium px-4 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Add to services
                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
