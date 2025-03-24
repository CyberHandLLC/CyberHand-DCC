import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Plus, Filter, Search, ChevronDown, 
  AlertCircle, CheckCircle, Clock, User, X, 
  RefreshCw
} from 'lucide-react';

// Import API services
import supportAPI, { SupportTicket } from '../../../../../api/services/supportAPI';

// Import custom hooks
import useApiError from '../../../../../hooks/useApiError';

// Import shared components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';

// Mock support tickets data
const mockTickets = [
  {
    id: 1,
    title: 'Website contact form not working',
    description: 'The contact form on our website is returning an error when submitted. This is affecting potential leads.',
    status: 'Open',
    priority: 'High',
    category: 'Website',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-16T10:30:00Z',
    assignedTo: 'Emily Rodriguez',
    messages: [
      {
        id: 101,
        sender: 'John Smith',
        senderRole: 'Client',
        message: 'The contact form on our website is returning an error when submitted. This is affecting potential leads.',
        timestamp: '2025-03-15T00:00:00Z'
      },
      {
        id: 102,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'Thanks for bringing this to our attention. I\'ll check the form configuration and get back to you shortly.',
        timestamp: '2025-03-15T09:25:00Z'
      },
      {
        id: 103,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I found the issue - there was a problem with the form submission endpoint. I\'ve made a fix, could you please test it and let me know if it works now?',
        timestamp: '2025-03-16T10:30:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Request for additional social media posts',
    description: 'We need to increase our social media presence for our upcoming product launch. Can we add 5 more posts to this month\'s schedule?',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Social Media',
    createdAt: '2025-03-10T00:00:00Z',
    updatedAt: '2025-03-13T14:45:00Z',
    assignedTo: 'Emily Rodriguez',
    messages: [
      {
        id: 201,
        sender: 'John Smith',
        senderRole: 'Client',
        message: 'We need to increase our social media presence for our upcoming product launch. Can we add 5 more posts to this month\'s schedule?',
        timestamp: '2025-03-10T00:00:00Z'
      },
      {
        id: 202,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I\'ll check our current schedule and see what we can do. When is the product launch planned for?',
        timestamp: '2025-03-10T11:15:00Z'
      },
      {
        id: 203,
        sender: 'John Smith',
        senderRole: 'Client',
        message: 'The launch is scheduled for March 30th. We really need to build up excitement starting next week.',
        timestamp: '2025-03-11T09:20:00Z'
      },
      {
        id: 204,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I\'ve reviewed our content calendar and we can definitely add the 5 additional posts. I\'ll send over a revised schedule for your approval by tomorrow.',
        timestamp: '2025-03-13T14:45:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'Google Ads campaign optimization',
    description: 'Our Google Ads campaign is not performing as well as expected. Can we review and optimize the keywords and ad copy?',
    status: 'Closed',
    priority: 'Medium',
    category: 'Paid Advertising',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-08T16:20:00Z',
    assignedTo: 'Emily Rodriguez',
    messages: [
      {
        id: 301,
        sender: 'John Smith',
        senderRole: 'Client',
        message: 'Our Google Ads campaign is not performing as well as expected. Can we review and optimize the keywords and ad copy?',
        timestamp: '2025-03-01T00:00:00Z'
      },
      {
        id: 302,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I\'ll analyze the current campaign performance and prepare some recommendations for improvements.',
        timestamp: '2025-03-02T10:05:00Z'
      },
      {
        id: 303,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I\'ve completed the analysis and have several suggestions. I\'ve attached a report with the findings and recommended changes. Would you like to schedule a call to discuss?',
        timestamp: '2025-03-04T15:30:00Z'
      },
      {
        id: 304,
        sender: 'John Smith',
        senderRole: 'Client',
        message: 'The report looks great, and I agree with the proposed changes. Let\'s move forward with the optimizations as suggested.',
        timestamp: '2025-03-06T11:45:00Z'
      },
      {
        id: 305,
        sender: 'Emily Rodriguez',
        senderRole: 'Staff',
        message: 'I\'ve implemented all the recommended changes to the campaign. We should start seeing improved results within a week or so. I\'ll monitor closely and provide an update next week.',
        timestamp: '2025-03-08T16:20:00Z'
      }
    ]
  }
];

interface SupportTicketsProps {
  theme: 'light' | 'dark';
}

const SupportTickets: React.FC<SupportTicketsProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  // Error handling hook
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);
  
  // Fetch tickets based on status filter
  const fetchTickets = async () => {
    try {
      let response;
      
      if (statusFilter === 'all') {
        response = await handleApiCall(
          supportAPI.getAllTickets(),
          { context: 'Fetching all support tickets' }
        );
      } else {
        response = await handleApiCall(
          supportAPI.getTicketsByStatus(statusFilter),
          { context: `Fetching ${statusFilter} tickets` }
        );
      }
      
      if (response?.data) {
        setTickets(response.data);
      } else {
        // Fallback to mock data if API fails
        setTickets(mockTickets as SupportTicket[]);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      // Fallback to mock data
      setTickets(mockTickets as SupportTicket[]);
    }
  };
  
  // Submit a new message to a ticket
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTicket || !newMessage.trim()) return;
    
    try {
      const response = await handleApiCall(
        supportAPI.addMessage({
          ticketId: selectedTicket,
          message: newMessage.trim()
        }),
        { context: 'Sending support message' }
      );
      
      if (response?.data) {
        // Refresh the ticket to show the new message
        const ticketResponse = await handleApiCall(
          supportAPI.getTicketById(selectedTicket),
          { context: 'Refreshing ticket' }
        );
        
        if (ticketResponse?.data) {
          // Update the ticket in the tickets array with the new data
          setTickets(prevTickets => 
            prevTickets.map(ticket => 
              ticket.id === selectedTicket ? ticketResponse.data as SupportTicket : ticket
            )
          );
          
          // Clear the message input
          setNewMessage('');
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Error is already handled by useApiError hook
    }
  };
  
  // Close a ticket
  const handleCloseTicket = async (ticketId: number) => {
    try {
      const response = await handleApiCall(
        supportAPI.closeTicket(ticketId),
        { context: 'Closing support ticket' }
      );
      
      if (response?.data) {
        // Update the ticket in the state
        setTickets(prevTickets => 
          prevTickets.map(ticket => 
            ticket.id === ticketId ? { ...ticket, status: 'Closed' } : ticket
          )
        );
      }
    } catch (err) {
      console.error('Error closing ticket:', err);
      // Error is already handled by useApiError hook
    }
  };
  
  // Reopen a ticket
  const handleReopenTicket = async (ticketId: number) => {
    try {
      const response = await handleApiCall(
        supportAPI.reopenTicket(ticketId),
        { context: 'Reopening support ticket' }
      );
      
      if (response?.data) {
        // Update the ticket in the state
        setTickets(prevTickets => 
          prevTickets.map(ticket => 
            ticket.id === ticketId ? { ...ticket, status: 'Open' } : ticket
          )
        );
      }
    } catch (err) {
      console.error('Error reopening ticket:', err);
      // Error is already handled by useApiError hook
    }
  };

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get the selected ticket details
  const ticketDetails = selectedTicket !== null 
    ? tickets.find(ticket => ticket.id === selectedTicket) 
    : null;

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Format timestamp to a readable format
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Get appropriate CSS class for ticket status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get appropriate CSS class for ticket priority
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className={`text-xl font-semibold mb-4 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Support & Requests
        </h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Refresh button */}
          <button
            onClick={fetchTickets}
            disabled={isLoading}
            className={`p-2 rounded-md ${theme === 'light' ? 'bg-white border border-gray-300' : 'bg-[#1e2a45] border border-[#2a3448]'}`}
          >
            <RefreshCw 
              size={16} 
              className={`${isLoading ? 'animate-spin' : ''} ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
            />
          </button>
          
          {/* Search input */}
          <div className={`relative ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              className={`pl-10 pr-4 py-2 text-sm rounded-md w-full md:w-64 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-300 focus:ring-teal-500 focus:border-teal-500' 
                  : 'bg-[#1e2a45] border border-[#2a3448] focus:ring-teal-400 focus:border-teal-400'
              }`}
              placeholder="Search support tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm rounded-md ${
                theme === 'light' 
                  ? 'bg-white border border-gray-300 text-gray-700' 
                  : 'bg-[#1e2a45] border border-[#2a3448] text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>
                  {statusFilter === 'all' ? 'All Statuses' : 
                   statusFilter === 'Open' ? 'Open' : 
                   statusFilter === 'In Progress' ? 'In Progress' : 
                   'Closed'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {isFilterOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg z-10 ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-[#1e2a45] border border-[#2a3448]'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setIsFilterOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-[#2a3448]'
                    } ${statusFilter === 'all' ? 'bg-gray-100 dark:bg-[#2a3448]' : ''}`}
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('Open');
                      setIsFilterOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-[#2a3448]'
                    } ${statusFilter === 'Open' ? 'bg-gray-100 dark:bg-[#2a3448]' : ''}`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('In Progress');
                      setIsFilterOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-[#2a3448]'
                    } ${statusFilter === 'In Progress' ? 'bg-gray-100 dark:bg-[#2a3448]' : ''}`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('Closed');
                      setIsFilterOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-[#2a3448]'
                    } ${statusFilter === 'Closed' ? 'bg-gray-100 dark:bg-[#2a3448]' : ''}`}
                  >
                    Closed
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Create ticket button */}
          <button
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              theme === 'light'
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-6">
          <ErrorDisplay
            error={error}
            onDismiss={clearError}
          />
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && !tickets.length ? (
        <div className="flex justify-center items-center p-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${theme === 'light' ? 'border-teal-500' : 'border-teal-400'}`}></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tickets list */}
          <div className={`w-full md:w-2/5 lg:w-1/3 ${selectedTicket ? 'hidden md:block' : ''}`}>
            {filteredTickets.length > 0 ? (
              <div className={`border rounded-lg overflow-hidden ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                <ul className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-[#2a3448]'}`}>
                  {filteredTickets.map((ticket) => (
                    <li key={ticket.id}>
                      <button
                        onClick={() => setSelectedTicket(ticket.id)}
                        className={`w-full text-left p-4 ${
                          selectedTicket === ticket.id
                            ? theme === 'light'
                              ? 'bg-teal-50'
                              : 'bg-teal-900/20'
                            : theme === 'light'
                            ? 'bg-white hover:bg-gray-50'
                            : 'bg-[#162238] hover:bg-[#1e2a45]'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {ticket.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className={`mt-1 text-sm line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {ticket.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`inline-flex items-center text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {ticket.messages.length}
                          </span>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(ticket.updatedAt)}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={`text-center py-8 border rounded-lg ${theme === 'light' ? 'border-gray-200 text-gray-500' : 'border-[#2a3448] text-gray-400'}`}>
                {searchQuery ? 'No tickets match your search.' : 'No support tickets found.'}
              </div>
            )}
          </div>
          
          {/* Ticket detail view */}
          {selectedTicket ? (
            <div className="w-full md:w-3/5 lg:w-2/3">
              {ticketDetails ? (
                <div className={`border rounded-lg overflow-hidden ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                  {/* Ticket header */}
                  <div className={`p-4 border-b ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1e2a45] border-[#2a3448]'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h2 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {ticketDetails.title}
                          </h2>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticketDetails.status)}`}>
                            {ticketDetails.status}
                          </span>
                        </div>
                        <div className={`mt-1 flex items-center text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span>Ticket #{ticketDetails.id}</span>
                          <span className="mx-1">•</span>
                          <span>Created {formatDate(ticketDetails.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(ticketDetails.priority)}`}>
                            {ticketDetails.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {ticketDetails.status !== 'Closed' ? (
                          <button
                            onClick={() => handleCloseTicket(ticketDetails.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-md ${
                              theme === 'light'
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-green-900/30 text-green-400 hover:bg-green-900/40'
                            }`}
                          >
                            Close Ticket
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReopenTicket(ticketDetails.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-md ${
                              theme === 'light'
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/40'
                            }`}
                          >
                            Reopen Ticket
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className={`md:hidden inline-flex items-center justify-center p-1 rounded-md ${
                            theme === 'light'
                              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a3448]'
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {ticketDetails.description}
                    </p>
                    <div className={`mt-3 pt-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                      <div className={`text-xs flex items-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className="font-medium">Category:</span>
                        <span className="ml-1">{ticketDetails.category}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Assigned to:</span>
                        <span className="ml-1 inline-flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticketDetails.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message thread */}
                  <div className={`p-4 ${theme === 'light' ? 'bg-white' : 'bg-[#162238]'}`}>
                    <h3 className={`text-sm font-medium mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Conversation
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                      {ticketDetails.messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            message.senderRole === 'Client'
                              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`font-medium text-sm ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                {message.sender}
                              </span>
                              <span className={`ml-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {message.senderRole}
                              </span>
                              <span className={`ml-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <div className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                              {message.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Reply form */}
                    {ticketDetails.status !== 'Closed' && (
                      <form onSubmit={handleSubmitMessage}>
                        <div className={`border rounded-md ${theme === 'light' ? 'border-gray-300' : 'border-[#2a3448]'}`}>
                          <textarea
                            className={`block w-full p-3 text-sm rounded-t-md resize-none ${
                              theme === 'light'
                                ? 'bg-white text-gray-700 focus:ring-teal-500 focus:border-teal-500'
                                : 'bg-[#1e2a45] text-gray-300 focus:ring-teal-400 focus:border-teal-400'
                            }`}
                            rows={3}
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isLoading}
                          ></textarea>
                          <div className={`flex justify-between items-center px-3 py-2 rounded-b-md ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}>
                            <div></div>
                            <button
                              type="submit"
                              disabled={!newMessage.trim() || isLoading}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                !newMessage.trim() || isLoading
                                  ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                                  : theme === 'light'
                                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                                  : 'bg-teal-600 text-white hover:bg-teal-700'
                              }`}
                            >
                              {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`flex justify-center items-center p-12 border rounded-lg ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                  <div className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Ticket not found.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex md:w-3/5 lg:w-2/3 items-center justify-center">
              <div className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
