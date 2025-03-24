import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, User, Building, Mail, Phone, Calendar, Globe, Shield, Loader } from 'lucide-react';

// Import error handling components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import useApiError from '../../../../../hooks/useApiError';
import clientAPI from '../../../../../api/services/clientAPI';
import staffAPI from '../../../../../api/services/staffAPI';
import serviceAPI from '../../../../../api/services/serviceAPI';
import LoadingState from '../../../../../components/ui/LoadingState';

// Import types
import { Client } from '../../../../../types/client';
import { ClientService } from '../../../../../types/service';

// Extended client detail interface with subscription information
interface ExtendedClientDetail {
  id: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  status?: string;
  type?: 'individual' | 'business';
  phone?: string;
  createdAt?: string;
  website?: string;
  subscriptionPlan?: string;
  paymentStatus?: 'active' | 'overdue' | 'pending' | 'canceled';
  nextBillingDate?: string;
  subscriptionStartDate?: string;
  twoFactorEnabled?: boolean;
  services?: ClientService[];
}

// Extended service type with renewal date
interface ExtendedClientService extends ClientService {
  renewalDate?: string;
}

interface ClientDetailsProps {
  theme: 'light' | 'dark';
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ theme }) => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ExtendedClientDetail | null>(null);
  const [clientServices, setClientServices] = useState<ExtendedClientService[]>([]);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch client details on component mount
  useEffect(() => {
    if (!clientId) return;
    
    fetchClientDetails();
    fetchClientServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);
  
  // Fetch client details
  const fetchClientDetails = useCallback(async () => {
    if (!clientId) return;
    
    try {
      // Fetch client info from staffAPI
      const clientResponse = await handleApiCall(
        staffAPI.getClientDetails(clientId),
        { context: 'Fetching client details' }
      );
      
      if (clientResponse?.data) {
        // Convert response data to ExtendedClientDetail type
        const clientData: ExtendedClientDetail = {
          ...clientResponse.data,
          // Ensure ID is handled as a string for consistency in the UI
          id: clientResponse.data.id.toString(),
          // Add default values for extended fields
          status: clientResponse.data.status || 'inactive',
          subscriptionPlan: 'Basic Plan',
          paymentStatus: 'active',
          twoFactorEnabled: false
        };
        setClient(clientData);
      }
    } catch (err) {
      // Error already handled by useApiError
    }
  }, [clientId, handleApiCall]);

  // Fetch client services
  const fetchClientServices = useCallback(async () => {
    if (!clientId) return;
    
    try {
      const servicesResponse = await handleApiCall(
        serviceAPI.getClientServices(clientId),
        { context: 'Fetching client services' }
      );
      
      if (servicesResponse?.data) {
        // Convert to ExtendedClientService with added renewalDate
        const extendedServices: ExtendedClientService[] = servicesResponse.data.map(service => ({
          ...service,
          renewalDate: service.startDate ? new Date(new Date(service.startDate).setFullYear(new Date(service.startDate).getFullYear() + 1)).toISOString() : undefined
        }));
        setClientServices(extendedServices);
      }
    } catch (err) {
      // Error already handled by useApiError
    }
  }, [clientId, handleApiCall]);
  
  // Delete client
  const handleDeleteClient = useCallback(async () => {
    if (!clientId) return;
    
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await handleApiCall(
          clientAPI.deleteClient(parseInt(clientId, 10)),
          { context: 'Deleting client' }
        );
        
        // Navigate back to client management on successful delete
        navigate('/dashboard/admin/client-management');
      } catch (err) {
        // Error already handled by useApiError
      }
    }
  }, [clientId, handleApiCall, navigate]);
  
  // Helper to get client name regardless of type
  const getClientName = (client: ExtendedClientDetail): string => {
    return client.firstName ? `${client.firstName} ${client.lastName || ''}` : (client.name || 'Unknown');
  };
  
  // Helper to get company name or empty string
  const getCompanyName = (client: ExtendedClientDetail): string => {
    return client.name && client.type === 'business' ? client.name : '';
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="w-full">
      {/* Header with back button, title, and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={`mr-3 p-2 rounded-full ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#1e2a45]'}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Client Details
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/admin/client-management/edit/${clientId}`)}
            className={`px-3 py-2 ${theme === 'light' ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' : 'bg-teal-900 bg-opacity-30 text-teal-400 hover:bg-opacity-50'} rounded-md flex items-center`}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={handleDeleteClient}
            className={`px-3 py-2 ${theme === 'light' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-red-900 bg-opacity-30 text-red-400 hover:bg-opacity-50'} rounded-md flex items-center`}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-4">
          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
          />
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <LoadingState 
          message="Loading client details..." 
          theme={theme}
          context="Retrieving client information"
        />
      )}
      
      {/* Client details */}
      {!isLoading && client && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic information card */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm col-span-1`}>
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100' : 'bg-[#2a3448]'}`}>
                {client.type === 'business' ? (
                  <Building className={`h-6 w-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                ) : (
                  <User className={`h-6 w-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                )}
              </div>
              <div className="ml-4">
                <h2 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {getClientName(client)}
                </h2>
                {getCompanyName(client) && (
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {getCompanyName(client)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-t border-b py-3 mb-3 space-y-3">
              <div className="flex">
                <Mail className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {client.email}
                </span>
              </div>
              {client.phone && (
                <div className="flex">
                  <Phone className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {client.phone}
                  </span>
                </div>
              )}
              {client.createdAt && (
                <div className="flex">
                  <Calendar className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Customer since {formatDate(client.createdAt)}
                  </span>
                </div>
              )}
              {client.website && (
                <div className="flex">
                  <Globe className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <a 
                    href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${theme === 'light' ? 'text-teal-600 hover:text-teal-800' : 'text-teal-400 hover:text-teal-300'}`}
                  >
                    {client.website}
                  </a>
                </div>
              )}
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Status
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                client.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Unknown'}
              </span>
            </div>
          </div>
          
          {/* Subscription details card */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm col-span-1`}>
            <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Subscription Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Plan
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {client.subscriptionPlan || 'No subscription plan found'}
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Payment Status
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  client.paymentStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  client.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  client.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {client.paymentStatus ? client.paymentStatus.charAt(0).toUpperCase() + client.paymentStatus.slice(1) : 'Unknown'}
                </span>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Next Billing Date
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formatDate(client.nextBillingDate)}
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Subscription Start Date
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formatDate(client.subscriptionStartDate)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Security settings card */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm col-span-1`}>
            <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Security Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Two-Factor Authentication
                </div>
                <div className="flex items-center">
                  <Shield className={`h-4 w-4 mr-2 ${
                    client.twoFactorEnabled 
                      ? (theme === 'light' ? 'text-green-500' : 'text-green-400') 
                      : (theme === 'light' ? 'text-gray-400' : 'text-gray-500')
                  }`} />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {client.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Last Login
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  N/A
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Password Last Changed
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  N/A
                </div>
              </div>
            </div>
          </div>
          
          {/* Services section */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-5 shadow-sm col-span-3`}>
            <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Services
            </h2>
            
            {clientServices.length === 0 ? (
              <div className={`text-center py-6 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                No services found for this client.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                  <thead>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                        Service Name
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                        Start Date
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                        Renewal Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                    {clientServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {service.name}
                          </div>
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {service.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            service.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            service.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                            service.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {service.status ? service.status.charAt(0).toUpperCase() + service.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(service.startDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(service.renewalDate)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
