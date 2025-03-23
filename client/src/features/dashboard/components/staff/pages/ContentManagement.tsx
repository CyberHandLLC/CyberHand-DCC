import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  ChevronDown, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Image, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Link2, 
  Mail 
} from 'lucide-react';

// Mock clients data
const mockClients = [
  { id: 1, name: 'Thompson Consulting' },
  { id: 2, name: 'Garcia & Partners' },
  { id: 3, name: 'Johnson Media' },
  { id: 4, name: 'Chen Technologies' },
  { id: 5, name: 'Rivera Design' },
];

// Mock content data
const mockContent = [
  {
    id: 1,
    title: 'Top 10 Digital Marketing Trends for 2025',
    type: 'Blog Post',
    status: 'Published',
    client: 'Johnson Media',
    clientId: 3,
    platform: 'Website',
    dueDate: '2025-03-15T00:00:00Z',
    publishDate: '2025-03-18T00:00:00Z',
    author: 'Emily Rodriguez',
    brief: 'Write an SEO-optimized blog post covering the top digital marketing trends for 2025, focusing on AI, personalization, and voice search.',
    keywords: ['digital marketing', 'marketing trends', '2025 trends', 'AI marketing', 'personalization']
  },
  {
    id: 2,
    title: 'New Product Launch Campaign',
    type: 'Social Media',
    status: 'Scheduled',
    client: 'Chen Technologies',
    clientId: 4,
    platform: 'Instagram',
    dueDate: '2025-03-20T00:00:00Z',
    publishDate: '2025-03-25T09:00:00Z',
    author: 'Emily Rodriguez',
    brief: 'Create a series of 5 Instagram posts announcing the new product launch, focusing on key features and benefits.',
    keywords: ['product launch', 'tech', 'innovation', 'announcement']
  },
  {
    id: 3,
    title: 'Email Newsletter - April Edition',
    type: 'Email',
    status: 'Draft',
    client: 'Rivera Design',
    clientId: 5,
    platform: 'Email',
    dueDate: '2025-03-28T00:00:00Z',
    publishDate: null,
    author: 'Emily Rodriguez',
    brief: 'Create the monthly newsletter highlighting recent design projects, industry news, and upcoming events.',
    keywords: ['newsletter', 'design', 'monthly update', 'portfolio']
  },
  {
    id: 4,
    title: 'Benefits of AI for Small Businesses',
    type: 'Blog Post',
    status: 'In Review',
    client: 'Thompson Consulting',
    clientId: 1,
    platform: 'Website',
    dueDate: '2025-03-10T00:00:00Z',
    publishDate: null,
    author: 'Emily Rodriguez',
    brief: 'Write a detailed blog post about how small businesses can leverage AI technologies to improve operations and customer experience.',
    keywords: ['AI', 'small business', 'technology', 'automation', 'efficiency']
  },
  {
    id: 5,
    title: 'Client Case Study: Successful Rebrand',
    type: 'Case Study',
    status: 'Published',
    client: 'Garcia & Partners',
    clientId: 2,
    platform: 'Website',
    dueDate: '2025-03-05T00:00:00Z',
    publishDate: '2025-03-08T00:00:00Z',
    author: 'Emily Rodriguez',
    brief: 'Create a detailed case study showcasing the successful rebranding project for XYZ Corp, focusing on process, challenges, and results.',
    keywords: ['case study', 'rebranding', 'brand strategy', 'success story']
  },
  {
    id: 6,
    title: 'Weekly Social Media Updates',
    type: 'Social Media',
    status: 'In Progress',
    client: 'Johnson Media',
    clientId: 3,
    platform: 'Multiple',
    dueDate: '2025-03-22T00:00:00Z',
    publishDate: null,
    author: 'Emily Rodriguez',
    brief: 'Create content for this week\'s social media posts across all platforms (Facebook, Twitter, Instagram, LinkedIn).',
    keywords: ['social media', 'weekly content', 'engagement', 'brand awareness']
  },
  {
    id: 7,
    title: 'Product Feature Video',
    type: 'Video',
    status: 'Not Started',
    client: 'Chen Technologies',
    clientId: 4,
    platform: 'YouTube',
    dueDate: '2025-04-10T00:00:00Z',
    publishDate: null,
    author: 'Emily Rodriguez',
    brief: 'Create a 2-minute product demo video showcasing the key features of the new software update.',
    keywords: ['product video', 'demo', 'features', 'software', 'tutorial']
  }
];

interface ContentManagementProps {
  theme: 'light' | 'dark';
}

const ContentManagement: React.FC<ContentManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);

  // Filter content based on search, status, type, and client
  const filteredContent = mockContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         content.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    const matchesClient = clientFilter === null || content.clientId === clientFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesClient;
  });

  // Get unique content types for filter dropdown
  const contentTypes = ['all', ...mockContent
    .map(content => content.type)
    .filter((type, index, array) => array.indexOf(type) === index)
  ];

  // Get appropriate CSS class for content status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Not Started':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      case 'website':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-yellow-500" />;
      case 'multiple':
        return <Link2 className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Calculate days until due or days overdue
  const getDueDateInfo = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return {
        text: `${diffDays} days left`,
        class: diffDays <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due today',
        class: 'text-red-600 dark:text-red-400 font-medium'
      };
    } else {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        class: 'text-red-600 dark:text-red-400 font-medium'
      };
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-5">
        {/* Client selector sidebar */}
        <div className={`lg:w-64 p-4 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'} lg:sticky lg:top-4 h-auto max-h-screen`}>
          <h2 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Clients</h2>
          
          <div className={`space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto`}>
            <button
              className={`w-full text-left px-3 py-2 rounded-md ${clientFilter === null ? 
                (theme === 'light' ? 'bg-teal-100 text-teal-800' : 'bg-teal-900 text-teal-200') : 
                (theme === 'light' ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-[#1e2a45] text-gray-200')}`}
              onClick={() => setClientFilter(null)}
            >
              All Clients
            </button>
            
            {mockClients.map(client => (
              <button
                key={client.id}
                className={`w-full text-left px-3 py-2 rounded-md ${clientFilter === client.id ? 
                  (theme === 'light' ? 'bg-teal-100 text-teal-800' : 'bg-teal-900 text-teal-200') : 
                  (theme === 'light' ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-[#1e2a45] text-gray-200')}`}
                onClick={() => setClientFilter(client.id)}
              >
                {client.name}
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className={`w-full flex items-center justify-center px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
            <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Content Management {clientFilter !== null && `- ${mockClients.find(c => c.id === clientFilter)?.name}`}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
                <Search className="h-4 w-4 absolute left-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search content..."
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
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Published' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Published')}
                      >
                        Published
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Scheduled' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Scheduled')}
                      >
                        Scheduled
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'In Review' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('In Review')}
                      >
                        In Review
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'In Progress' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('In Progress')}
                      >
                        In Progress
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Draft' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Draft')}
                      >
                        Draft
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Not Started' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                        onClick={() => setStatusFilter('Not Started')}
                      >
                        Not Started
                      </button>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      
                      <div className="px-4 py-2 text-sm font-medium">Content Type</div>
                      {contentTypes.map((type) => (
                        <button
                          key={type}
                          className={`w-full text-left px-4 py-2 text-sm ${typeFilter === type ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                          onClick={() => setTypeFilter(type)}
                        >
                          {type === 'all' ? 'All Types' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {filteredContent.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              {filteredContent.map((content) => {
                const dueDateInfo = getDueDateInfo(content.dueDate);
                const isSelected = selectedContent === content.id;
                
                return (
                  <div 
                    key={content.id}
                    className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'} cursor-pointer`}
                    onClick={() => setSelectedContent(isSelected ? null : content.id)}
                  >
                    <div className={`px-6 py-4 ${theme === 'light' ? 'bg-white' : 'bg-[#162238]'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {content.title}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(content.status)}`}>
                              {content.status}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex items-center flex-wrap gap-4">
                            <div className="flex items-center">
                              <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{content.type}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <User className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{content.client}</span>
                            </div>
                            
                            <div className="flex items-center">
                              {getPlatformIcon(content.platform)}
                              <span className={`ml-1 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{content.platform}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-0">
                          <div className="flex flex-col">
                            <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</div>
                            <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatDate(content.dueDate)}</div>
                            <div className={`text-xs ${dueDateInfo.class}`}>{dueDateInfo.text}</div>
                          </div>
                          
                          {content.publishDate && (
                            <div className="flex flex-col">
                              <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Published</div>
                              <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatDate(content.publishDate)}</div>
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <button 
                              className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-blue-600' : 'hover:bg-[#253552] text-blue-400'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Edit ${content.title}`);
                              }}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-red-500' : 'hover:bg-[#253552] text-red-400'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Delete ${content.title}`);
                              }}
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className={`px-6 py-4 border-t ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1e2a45] border-[#2a3448]'}`}>
                        <div className="mb-4">
                          <h4 className={`text-md font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Content Brief</h4>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{content.brief}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className={`text-md font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {content.keywords.map((keyword, idx) => (
                              <span 
                                key={idx}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-[#253552] text-gray-200'}`}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4 space-x-2">
                          {content.status !== 'Published' && (
                            <>
                              <button className={`px-3 py-1.5 rounded-md text-sm ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#253552] text-gray-300 hover:bg-[#2a3448]'}`}>
                                Save Draft
                              </button>
                              <button className={`px-3 py-1.5 rounded-md text-sm ${theme === 'light' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-900 text-blue-300 hover:bg-blue-800'}`}>
                                Submit for Review
                              </button>
                              {content.status === 'In Review' && (
                                <button className={`px-3 py-1.5 rounded-md text-sm ${theme === 'light' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                                  Publish
                                </button>
                              )}
                            </>
                          )}
                          <button className={`px-3 py-1.5 rounded-md text-sm ${theme === 'light' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                            Edit Content
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`py-10 text-center ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg`}>
              <div className={`text-lg font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                No content found
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                Try adjusting your search or filters, or create new content
              </p>
              <button
                className={`mt-4 px-4 py-2 ${theme === 'light' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded-md`}
              >
                <Plus className="h-4 w-4 inline-block mr-2" />
                Create Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
