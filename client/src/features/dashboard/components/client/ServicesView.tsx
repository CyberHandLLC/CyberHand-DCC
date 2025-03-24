import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { ArrowUpRight, Check, AlertTriangle, Loader } from 'lucide-react';
import useApiError from '../../../../hooks/useApiError';
import ErrorDisplay from '../../../../components/ui/ErrorDisplay';
import serviceAPI from '../../../../api/services/serviceAPI';
import { ClientService } from '../../../../types/service';

interface ServicesViewProps {
  theme?: 'light' | 'dark';
}

const ServicesView: React.FC<ServicesViewProps> = ({ theme = 'dark' }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [services, setServices] = useState<ClientService[]>([]);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch client services when component mounts
  useEffect(() => {
    fetchClientServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch services for the current client
  const fetchClientServices = async () => {
    if (!user?.id) return;

    const response = await handleApiCall(
      serviceAPI.getClientServices(user.id),
      { context: 'Fetching client services' }
    );
    
    if (response?.data) {
      setServices(response.data);
    }
  };
  
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
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError}
          className="mb-4"
        />
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading services...</span>
        </div>
      )}
      
      {/* Services Grid */}
      {!isLoading && filteredServices.length > 0 ? (
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                
                {/* Service details */}
                <div className={`mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  <div>
                    <span className={`block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Next Billing
                    </span>
                    <span className="font-medium">
                      {formatDate(service.nextBillingDate || null)}
                    </span>
                  </div>
                  <div>
                    <span className={`block ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Monthly Price
                    </span>
                    <span className="font-medium">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Service features */}
              {service.features && service.features.length > 0 && (
                <div className={`p-5 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-[#2a3448]'}`}>
                  <h4 className={`text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Included Features
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className={`mt-0.5 mr-2 flex-shrink-0 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} />
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Actions */}
              <div className="p-5 flex justify-between items-center">
                <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {service.status === 'active' && (
                    <span className="flex items-center">
                      <AlertTriangle size={14} className="mr-1 text-yellow-500" />
                      Cancellation requires 30-day notice
                    </span>
                  )}
                </div>
                <Link 
                  to={`/dashboard/service/${service.id}`}
                  className={`inline-flex items-center text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-800' : 'text-teal-400 hover:text-teal-300'}`}
                >
                  View Details
                  <ArrowUpRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading && (
        <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {filter !== 'all' 
            ? `No ${filter} services found.` 
            : 'No services found. Contact your account manager to add services.'}
        </div>
      )}
      
      {/* Retry button if there was an error */}
      {error && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchClientServices}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesView;
