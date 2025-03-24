import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, UserPlus, ChevronDown, Loader, RefreshCw } from 'lucide-react';

// Import error handling components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import useApiError from '../../../../../hooks/useApiError';
import staffAPI from '../../../../../api/services/staffAPI';

// Import types
import { Client } from '../../../../../types/client';

interface ClientsViewProps {
  theme: 'light' | 'dark';
}

const ClientsView: React.FC<ClientsViewProps> = ({ theme }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  // Fetch clients on component mount and when status filter changes
  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Fetch clients with proper error handling
  const fetchClients = async () => {
    try {
      // Use getAssignedClients instead of getAllClients
      const response = await handleApiCall(
        staffAPI.getAssignedClients(),
        { context: 'Fetching clients' }
      );
      
      if (response?.data) {
        setClients(response.data);
      }
    } catch (err) {
      // Error already handled by useApiError hook
      console.error('Error fetching clients:', err);
    }
  };

  // Filter clients based on search query and status filter
  const filteredClients = clients.filter(client => {
    // Status filter
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false;
    }
    
    // Search query filter
    const name = 'firstName' in client ? `${client.firstName} ${client.lastName}` : client.name;
    const companyName = 'name' in client ? client.name : '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper to get appropriate CSS class for client status
  const getStatusClass = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper to get client name regardless of type
  const getClientName = (client: Client): string => {
    return 'firstName' in client ? `${client.firstName} ${client.lastName}` : client.name;
  };

  // Helper to get company name or empty string
  const getCompanyName = (client: Client): string => {
    return 'name' in client && 'type' in client && client.type === 'business' ? client.name : '';
  };

  return (
    <div className="w-full">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Clients
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search input */}
          <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
            <Search className="h-4 w-4 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search clients..."
              className={`pl-9 pr-4 py-2 w-full sm:w-64 rounded-md focus:outline-none ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#182032] text-white'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter dropdown */}
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
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'pending' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Add client button */}
          <button 
            onClick={() => navigate('/dashboard/staff/clients/add')}
            className={`px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md flex items-center justify-center`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>
      
      {/* Display errors with retry functionality */}
      {error && (
        <div className="mb-6">
          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
            onRetry={() => {
              clearError();
              fetchClients();
            }}
          />
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className={`flex flex-col items-center justify-center py-12 ${theme === 'light' ? 'bg-white' : 'bg-[#162238]'} rounded-lg shadow mb-6`}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mb-3"></div>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading clients...</p>
        </div>
      )}
      
      {/* No clients found message with retry button */}
      {!isLoading && clients.length === 0 && (
        <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg p-8 text-center mb-6`}>
          <p className={`text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            No clients found.
          </p>
          <button
            onClick={fetchClients}
            className={`inline-flex items-center px-4 py-2 ${theme === 'light' ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' : 'bg-teal-900 bg-opacity-30 text-teal-400 hover:bg-opacity-50'} rounded-md`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      )}

      {/* Clients list with retry button if no clients found */}
      {!isLoading && clients.length > 0 && (
        <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} border rounded-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#182032]'}`}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500 uppercase tracking-wider' : 'text-gray-400 uppercase tracking-wider'}`}>
                    Client
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500 uppercase tracking-wider' : 'text-gray-400 uppercase tracking-wider'}`}>
                    Email
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500 uppercase tracking-wider' : 'text-gray-400 uppercase tracking-wider'}`}>
                    Status
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500 uppercase tracking-wider' : 'text-gray-400 uppercase tracking-wider'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-gray-700'}`}>
                {filteredClients.map((client) => (
                  <tr key={client.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1a2944]'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100' : 'bg-[#2a3448]'}`}>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                            {getClientName(client).charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {getClientName(client)}
                          </div>
                          {getCompanyName(client) && (
                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {getCompanyName(client)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>
                        {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/dashboard/staff/clients/${client.id}`)}
                        className={`inline-flex items-center ${theme === 'light' ? 'text-teal-600 hover:text-teal-900' : 'text-teal-400 hover:text-teal-300'}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
