import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, Calendar, MessageSquare, Check, X, Clock, User, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApiError } from '../../../../../hooks/useApiError';
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import leadAPI, { Lead } from '../../../../../api/services/leadAPI';
import { ApiResponse } from '../../../../../api/types/api.types';

// Mock lead data for fallback
const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'Alex Thompson',
    company: 'Thompson Consulting',
    email: 'alex@thompson-consulting.com',
    phone: '(555) 123-4567',
    source: 'Website Contact Form',
    status: 'New',
    interestLevel: 'High',
    assignedTo: 'Emily Rodriguez',
    lastContact: '2025-03-18T14:30:00Z',
    notes: 'Interested in website development and SEO services.',
    nextFollowUp: '2025-03-23T10:00:00Z'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    company: 'Garcia & Partners',
    email: 'maria@garciallc.com',
    phone: '(555) 234-5678',
    source: 'LinkedIn Outreach',
    status: 'Contacted',
    interestLevel: 'Medium',
    assignedTo: 'Emily Rodriguez',
    lastContact: '2025-03-15T11:45:00Z',
    notes: 'Called to discuss social media management. Follows up requested after a week.',
    nextFollowUp: '2025-03-24T14:00:00Z'
  },
  {
    id: 3,
    name: 'James Wilson',
    company: 'Wilson Technologies',
    email: 'james@wilsontech.com',
    phone: '(555) 345-6789',
    source: 'Referral',
    status: 'Qualified',
    interestLevel: 'High',
    assignedTo: 'Emily Rodriguez',
    lastContact: '2025-03-20T09:15:00Z',
    notes: 'Very interested in our AI integration services. Meeting scheduled for demo.',
    nextFollowUp: '2025-03-25T15:30:00Z'
  },
  {
    id: 4,
    name: 'Sophia Park',
    company: 'Park Designs',
    email: 'sophia@parkdesigns.com',
    phone: '(555) 456-7890',
    source: 'Online Ad',
    status: 'Contacted',
    interestLevel: 'Low',
    assignedTo: 'Emily Rodriguez',
    lastContact: '2025-03-17T13:20:00Z',
    notes: 'Reached out after clicking ad. Currently using a competitor but may switch in the future.',
    nextFollowUp: '2025-04-01T11:00:00Z'
  },
  {
    id: 5,
    name: 'Omar Hassan',
    company: 'Hassan Enterprises',
    email: 'omar@hassanent.com',
    phone: '(555) 567-8901',
    source: 'Trade Show',
    status: 'New',
    interestLevel: 'Medium',
    assignedTo: 'Emily Rodriguez',
    lastContact: null,
    notes: 'Met at Digital Marketing Expo. Expressed interest in our marketing services.',
    nextFollowUp: '2025-03-23T13:00:00Z'
  }
];

interface LeadManagementProps {
  theme: 'light' | 'dark';
}

const LeadManagement: React.FC<LeadManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [leadDetailId, setLeadDetailId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      const response = await handleApiCall(
        leadAPI.getAllLeads(), 
        { context: "fetching leads" }
      );
      
      if (response?.data) {
        setLeads(response.data);
      } else {
        // Fall back to mock data if API fails
        setLeads(mockLeads);
      }
    };

    fetchLeads();
  }, [handleApiCall]);

  // Refetch leads when filters change
  useEffect(() => {
    if (statusFilter !== 'all' || interestFilter !== 'all') {
      const fetchFilteredLeads = async () => {
        let apiPromise: Promise<ApiResponse<Lead[]>>;
        
        if (statusFilter !== 'all' && interestFilter === 'all') {
          apiPromise = leadAPI.getLeadsByStatus(statusFilter);
        } else if (interestFilter !== 'all' && statusFilter === 'all') {
          apiPromise = leadAPI.getLeadsByInterestLevel(interestFilter);
        } else {
          apiPromise = leadAPI.getAllLeads();
        }
        
        const response = await handleApiCall(
          apiPromise,
          { context: "fetching filtered leads" }
        );
        
        if (response?.data) {
          setLeads(response.data);
        }
      };
      
      fetchFilteredLeads();
    }
  }, [handleApiCall, statusFilter, interestFilter]);

  // Filter leads based on search
  const filteredLeads = leads.filter(lead => {
    return lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lead.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Update lead status
  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const response = await handleApiCall(
      leadAPI.updateLeadStatus(leadId, newStatus),
      { context: `updating lead status to ${newStatus}` }
    );
    
    if (response?.data) {
      // Use a type-safe approach to update the lead in state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? response.data as Lead : lead
        )
      );
    }
  };

  // Schedule a follow-up
  const handleScheduleFollowUp = async (leadId: number, date: string) => {
    const response = await handleApiCall(
      leadAPI.scheduleFollowUp(leadId, date),
      { context: "scheduling follow-up" }
    );
    
    if (response?.data) {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? response.data as Lead : lead
        )
      );
    }
  };

  // Add note to lead
  const handleAddNote = async (leadId: number, content: string) => {
    // First add the note
    await handleApiCall(
      leadAPI.addLeadNote(leadId, content),
      { context: "adding note to lead" }
    );
    
    // Then fetch the updated lead details
    const response = await handleApiCall(
      leadAPI.getLeadById(leadId),
      { context: "refreshing lead after adding note" }
    );
    
    if (response?.data) {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? response.data as Lead : lead
        )
      );
    }
  };

  // Get appropriate CSS class for lead status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Converted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Lost':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get appropriate CSS class for interest level
  const getInterestClass = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Low':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not contacted yet';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Select a lead to show details
  const handleLeadSelect = (leadId: number) => {
    setLeadDetailId(leadDetailId === leadId ? null : leadId);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Lead Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
            <Search className="h-4 w-4 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search leads..."
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
                    All Statuses
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'New' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('New')}
                  >
                    New
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Contacted' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Contacted')}
                  >
                    Contacted
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Qualified' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Qualified')}
                  >
                    Qualified
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Converted' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Converted')}
                  >
                    Converted
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Lost' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Lost')}
                  >
                    Lost
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  
                  <div className="px-4 py-2 text-sm font-medium">Interest Level</div>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${interestFilter === 'all' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setInterestFilter('all')}
                  >
                    All Levels
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${interestFilter === 'High' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setInterestFilter('High')}
                  >
                    High
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${interestFilter === 'Medium' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setInterestFilter('Medium')}
                  >
                    Medium
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${interestFilter === 'Low' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setInterestFilter('Low')}
                  >
                    Low
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && <ErrorDisplay error={error} onDismiss={clearError} className="mb-4" />}

      {/* Loading state */}
      {isLoading && (
        <div className={`flex items-center justify-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p>Loading leads...</p>
          </div>
        </div>
      )}

      {/* No leads found */}
      {!isLoading && filteredLeads.length === 0 && (
        <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          <p>No leads found matching your filters.</p>
        </div>
      )}

      {/* Leads table */}
      {!isLoading && filteredLeads.length > 0 && (
        <div className={`overflow-x-auto rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-[#182032]'} border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
          <table className="w-full">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#12192e]'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Lead
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Contact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Interest
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Last Contact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Next Follow-up
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
              {filteredLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr 
                    className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'} ${leadDetailId === lead.id ? (theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]') : ''} cursor-pointer`}
                    onClick={() => handleLeadSelect(lead.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-[#253552]'}`}>
                          <User className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {lead.name}
                          </div>
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {lead.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{lead.email}</div>
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getInterestClass(lead.interestLevel)}`}>
                        {lead.interestLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {formatDate(lead.lastContact)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {formatDate(lead.nextFollowUp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-green-600' : 'hover:bg-[#253552] text-green-400'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Convert to client action
                            alert('Convert to client');
                          }}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button 
                          className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-red-500' : 'hover:bg-[#253552] text-red-400'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Mark as lost action
                            alert('Mark as lost');
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Lead detail row */}
                  {leadDetailId === lead.id && (
                    <tr className={theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Lead Details</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Source</div>
                                <div className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{lead.source}</div>
                              </div>
                              
                              <div>
                                <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</div>
                                <div className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{lead.assignedTo}</div>
                              </div>
                              
                              <div>
                                <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Notes</div>
                                <div className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{lead.notes}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Actions</h3>
                            
                            <div className="space-y-3">
                              <div className="flex space-x-2">
                                <button className={`flex items-center px-3 py-2 ${theme === 'light' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-300 hover:bg-blue-800'} rounded-md text-sm font-medium`}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </button>
                                <button className={`flex items-center px-3 py-2 ${theme === 'light' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-green-900 text-green-300 hover:bg-green-800'} rounded-md text-sm font-medium`}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </button>
                                <button className={`flex items-center px-3 py-2 ${theme === 'light' ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-amber-900 text-amber-300 hover:bg-amber-800'} rounded-md text-sm font-medium`}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  SMS
                                </button>
                              </div>
                              
                              <div>
                                <button className={`flex items-center px-3 py-2 ${theme === 'light' ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-purple-900 text-purple-300 hover:bg-purple-800'} rounded-md text-sm font-medium w-full`}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule Meeting
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <button className={`flex items-center justify-center px-3 py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-md text-sm font-medium`}>
                                  Update Status
                                </button>
                                <button className={`flex items-center justify-center px-3 py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-md text-sm font-medium`}>
                                  Add Note
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <button className={`flex items-center justify-center px-3 py-2 ${theme === 'light' ? 'bg-teal-100 text-teal-600 hover:bg-teal-200' : 'bg-teal-900 text-teal-300 hover:bg-teal-800'} rounded-md text-sm font-medium`}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Convert to Client
                                </button>
                                <button className={`flex items-center justify-center px-3 py-2 ${theme === 'light' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-red-900 text-red-300 hover:bg-red-800'} rounded-md text-sm font-medium`}>
                                  <X className="h-4 w-4 mr-2" />
                                  Mark as Lost
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-5 flex justify-between items-center">
        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          Showing {filteredLeads.length} of {leads.length} leads
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

export default LeadManagement;
