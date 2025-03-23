import React, { useState } from 'react';
import { Search, Filter, Download, Edit, Trash, MoreVertical, User, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock client data
const mockClients = [
  {
    id: 1,
    name: 'Alicia Koch',
    company: 'Koch Industries',
    email: 'alicia@koch.com',
    phone: '(555) 123-4567',
    status: 'active',
    totalSpend: 12850,
    activeServices: 3,
    joinDate: '2023-07-15'
  },
  {
    id: 2,
    name: 'Tom Wilson',
    company: 'Wilson Enterprises',
    email: 'tom@wilson.com',
    phone: '(555) 234-5678',
    status: 'active',
    totalSpend: 8450,
    activeServices: 2,
    joinDate: '2023-08-22'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    company: 'Johnson Media',
    email: 'sarah@johnson.com',
    phone: '(555) 345-6789',
    status: 'inactive',
    totalSpend: 5200,
    activeServices: 0,
    joinDate: '2023-05-10'
  },
  {
    id: 4,
    name: 'Michael Chen',
    company: 'Chen Technologies',
    email: 'michael@chen.com',
    phone: '(555) 456-7890',
    status: 'active',
    totalSpend: 15730,
    activeServices: 4,
    joinDate: '2023-03-05'
  },
  {
    id: 5,
    name: 'Jessica Rivera',
    company: 'Rivera Design',
    email: 'jessica@rivera.com',
    phone: '(555) 567-8901',
    status: 'pending',
    totalSpend: 2100,
    activeServices: 1,
    joinDate: '2023-09-18'
  }
];

interface ClientManagementProps {
  theme: 'light' | 'dark';
}

const ClientManagement: React.FC<ClientManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter clients based on search and status
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    } else if (sortBy === 'spend') {
      return b.totalSpend - a.totalSpend;
    } else if (sortBy === 'date') {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    }
    return 0;
  });

  // Get appropriate CSS class for client status
  const getStatusClass = (status: string) => {
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

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Client Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
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
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <div className="px-4 py-2 text-sm font-medium">Sort By</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'name' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setSortBy('name')}
                  >
                    Name
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'company' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setSortBy('company')}
                  >
                    Company
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'spend' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setSortBy('spend')}
                  >
                    Total Spend
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'date' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setSortBy('date')}
                  >
                    Join Date
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className={`px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md`}
          >
            Add Client
          </button>
          
          <button 
            className={`flex items-center px-4 py-2 ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-[#1e2a45] hover:bg-[#253552] text-gray-200'} rounded-md`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#12192e]'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Client
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Contact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Services
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Total Spend
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
              {sortedClients.map((client) => (
                <tr key={client.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-[#253552]'}`}>
                        <User className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {client.name}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{client.email}</div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{client.activeServices} active</div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Since {new Date(client.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ${client.totalSpend.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/dashboard/admin/client-management/${client.id}`}
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
        
        {sortedClients.length === 0 && (
          <div className={`py-10 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            No clients found. Try adjusting your search or filters.
          </div>
        )}
      </div>
      
      <div className="mt-5 flex justify-between items-center">
        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Showing {sortedClients.length} of {mockClients.length} clients
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

export default ClientManagement;
