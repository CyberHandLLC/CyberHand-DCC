import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash, ChevronDown, ArrowRight, Lock, User, Shield, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'ADMIN',
    status: 'active',
    lastLogin: '2025-03-20T14:30:00Z',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@johnson.com',
    role: 'CLIENT',
    status: 'active',
    lastLogin: '2025-03-21T09:15:00Z',
    createdAt: '2023-05-10T14:20:00Z',
    company: 'Johnson Media'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael@chen.com',
    role: 'CLIENT',
    status: 'active',
    lastLogin: '2025-03-19T16:45:00Z',
    createdAt: '2023-03-05T11:30:00Z',
    company: 'Chen Technologies'
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    role: 'STAFF',
    status: 'active',
    lastLogin: '2025-03-22T08:20:00Z',
    createdAt: '2023-06-12T09:00:00Z'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@wilson.com',
    role: 'STAFF',
    status: 'inactive',
    lastLogin: '2025-02-15T11:10:00Z',
    createdAt: '2023-04-22T15:45:00Z'
  },
  {
    id: 6,
    name: 'Jessica Rivera',
    email: 'jessica@rivera.com',
    role: 'CLIENT',
    status: 'active',
    lastLogin: '2025-03-18T13:25:00Z',
    createdAt: '2023-09-18T10:15:00Z',
    company: 'Rivera Design'
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    role: 'OBSERVER',
    status: 'active',
    lastLogin: '2025-03-17T15:30:00Z',
    createdAt: '2023-11-05T14:00:00Z'
  }
];

interface UserManagementProps {
  theme: 'light' | 'dark';
}

const UserManagement: React.FC<UserManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter users based on search, role, and status
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get appropriate CSS class for user status
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

  // Get appropriate role icon
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Shield className={`h-4 w-4 mr-1.5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />;
      case 'staff':
        return <Lock className={`h-4 w-4 mr-1.5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />;
      case 'client':
        return <User className={`h-4 w-4 mr-1.5 ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`} />;
      case 'observer':
        return <Eye className={`h-4 w-4 mr-1.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />;
      default:
        return <User className={`h-4 w-4 mr-1.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />;
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>User Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
            <Search className="h-4 w-4 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
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
                  <div className="px-4 py-2 text-sm font-medium">Role</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${roleFilter === 'all' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setRoleFilter('all')}
                  >
                    All Roles
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${roleFilter === 'admin' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setRoleFilter('admin')}
                  >
                    Admin
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${roleFilter === 'staff' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setRoleFilter('staff')}
                  >
                    Staff
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${roleFilter === 'client' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setRoleFilter('client')}
                  >
                    Client
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${roleFilter === 'observer' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setRoleFilter('observer')}
                  >
                    Observer
                  </button>
                  
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
            Add User
          </button>
        </div>
      </div>
      
      <div className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#12192e]'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  User
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Role
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Last Login
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Created
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-[#253552]'}`}>
                        <User className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {user.name}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {user.email}
                        </div>
                        {user.company && (
                          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {user.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {formatDate(user.lastLogin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/dashboard/admin/user-management/${user.id}`}
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
        
        {filteredUsers.length === 0 && (
          <div className={`py-10 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            No users found. Try adjusting your search or filters.
          </div>
        )}
      </div>
      
      <div className="mt-5 flex justify-between items-center">
        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Showing {filteredUsers.length} of {mockUsers.length} users
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

export default UserManagement;
