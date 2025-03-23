import React, { useState } from 'react';
import { 
  MessageCircle, Plus, Filter, Search, ChevronDown, 
  AlertCircle, CheckCircle, Clock, User, X
} from 'lucide-react';

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

  // Filter tickets based on search and status
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get the selected ticket details
  const ticketDetails = selectedTicket !== null 
    ? mockTickets.find(ticket => ticket.id === selectedTicket) 
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

  // Get status icon for ticket
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      {!selectedTicket ? (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
            <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Support Tickets</h1>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
                <Search className="h-4 w-4 absolute left-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tickets..."
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
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Open' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Open')}
                      >
                        Open
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'In Progress' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('In Progress')}
                      >
                        In Progress
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Closed' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Closed')}
                      >
                        Closed
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className={`flex items-center px-4 py-2 rounded-md ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200 bg-white hover:bg-gray-50' : 'border-[#2a3448] bg-[#162238] hover:bg-[#1e2a45]'} cursor-pointer`}
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <div className="px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        {getStatusIcon(ticket.status)}
                        <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} ml-1`}>
                          {ticket.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <span className={`inline-block mr-3 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Ticket #{ticket.id}
                        </span>
                        <span className={`inline-block mr-3 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Category: {ticket.category}
                        </span>
                      </div>
                      
                      <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {ticket.description.length > 120 ? ticket.description.substring(0, 120) + '...' : ticket.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <div className="flex items-center">
                        <User className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mr-1`} />
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {ticket.assignedTo}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Created: {formatDate(ticket.createdAt)}
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Last updated: {formatDate(ticket.updatedAt)}
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'light' ? 'text-teal-600 dark:text-teal-400' : 'text-teal-500 dark:text-teal-300'}`}>
                        {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className={`py-10 text-center ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg`}>
                <div className={`text-lg font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No tickets found
                </div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create a new support ticket to get help'}
                </p>
                <button
                  className={`mt-4 px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md`}
                >
                  <Plus className="h-4 w-4 inline-block mr-2" />
                  New Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Selected ticket details view
        <div>
          {ticketDetails && (
            <div className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
              {/* Ticket header */}
              <div className={`px-6 py-4 ${theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-[#162238] border-b border-[#2a3448]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <button 
                        onClick={() => setSelectedTicket(null)}
                        className={`p-1 -ml-1 rounded-md ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#1e2a45]'}`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                      <h2 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} ml-1`}>
                        Ticket #{ticketDetails.id}: {ticketDetails.title}
                      </h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(ticketDetails.status)}`}>
                        {ticketDetails.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(ticketDetails.priority)}`}>
                        {ticketDetails.priority} Priority
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-300'}`}>
                        {ticketDetails.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <button
                      className={`ml-2 px-3 py-1 rounded-md text-sm ${ticketDetails.status === 'Closed' ? 
                        (theme === 'light' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800') : 
                        (theme === 'light' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-red-900 text-red-300 hover:bg-red-800')}`}
                    >
                      {ticketDetails.status === 'Closed' ? 'Reopen Ticket' : 'Close Ticket'}
                    </button>
                  </div>
                </div>
                
                <div className={`mt-3 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="mr-3">Created: {formatDate(ticketDetails.createdAt)}</span>
                  <span className="mr-3">Updated: {formatDate(ticketDetails.updatedAt)}</span>
                  <span>Assigned to: {ticketDetails.assignedTo}</span>
                </div>
              </div>
              
              {/* Ticket conversation */}
              <div className={`px-6 py-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}>
                <div className={`mb-4 rounded-lg p-4 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'}`}>
                  <h3 className={`text-md font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Description</h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{ticketDetails.description}</p>
                </div>
                
                <h3 className={`text-md font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Conversation</h3>
                
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {ticketDetails.messages.map((message) => {
                    const isClient = message.senderRole === 'Client';
                    
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md rounded-lg p-4 ${
                          isClient ? 
                            (theme === 'light' ? 'bg-teal-100 text-teal-900' : 'bg-teal-900 text-teal-100') : 
                            (theme === 'light' ? 'bg-white border border-gray-200 text-gray-700' : 'bg-[#162238] border border-[#2a3448] text-gray-300')
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-medium ${
                              isClient ? 
                                (theme === 'light' ? 'text-teal-800' : 'text-teal-200') : 
                                (theme === 'light' ? 'text-gray-900' : 'text-white')
                            }`}>
                              {message.sender} {!isClient && `(${message.senderRole})`}
                            </span>
                            <span className={`text-xs ${
                              isClient ? 
                                (theme === 'light' ? 'text-teal-700' : 'text-teal-300') : 
                                (theme === 'light' ? 'text-gray-500' : 'text-gray-400')
                            }`}>
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Reply form */}
                {ticketDetails.status !== 'Closed' && (
                  <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} p-4`}>
                    <div className="flex flex-col">
                      <label htmlFor="reply" className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Reply to ticket
                      </label>
                      <textarea
                        id="reply"
                        rows={4}
                        className={`rounded-md border p-3 text-sm mb-3 ${
                          theme === 'light' ? 
                            'bg-white border-gray-300 text-gray-900 focus:border-teal-500' : 
                            'bg-[#1e2a45] border-[#2a3448] text-white focus:border-teal-400'
                        } focus:outline-none`}
                        placeholder="Type your reply here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end">
                        <button 
                          className={`px-4 py-2 rounded-md text-sm ${
                            theme === 'light' ? 
                              'bg-teal-500 hover:bg-teal-600 text-white' : 
                              'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                          disabled={!newMessage.trim().length}
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
