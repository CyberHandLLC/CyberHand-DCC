import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

// Import shared components
import StatusBadge from '../../../../../components/ui/StatusBadge';
import TabNavigation from '../../../../../components/ui/TabNavigation';
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';

// Import custom hooks
import useApiError from '../../../../../hooks/useApiError';

// Import API services
import contentAPI from '../../../../../api/services/contentAPI';

// Import types
import { ContentItem } from '../../../../../types/content';

// Import utilities
import { formatDate, shortenText } from '../../../../../utils/formatters';

// Import mock data for fallback
import { mockContent } from '../../../../../mock/content';

interface ContentManagementProps {
  clientId?: number;
}

const ContentManagement: React.FC<ContentManagementProps> = ({ clientId }) => {
  const [activeContentTab, setActiveContentTab] = useState("All Content");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [content, setContent] = useState<ContentItem[]>([]);
  
  // Error handling hook
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch content on component mount and when tab changes
  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContentTab]);
  
  // Fetch content based on active tab and clientId
  const fetchContent = async () => {
    try {
      let response;
      
      if (activeContentTab === "All Content") {
        if (clientId) {
          response = await handleApiCall(
            contentAPI.getContentByClient(String(clientId)),
            { context: 'Fetching client content' }
          );
        } else {
          response = await handleApiCall(
            contentAPI.getAllContent(),
            { context: 'Fetching all content' }
          );
        }
      } else {
        // Convert UI-friendly tab names to API status values
        const statusMap: Record<string, string> = {
          "Drafts": "draft",
          "Scheduled": "scheduled",
          "Published": "published"
        };
        
        const status = statusMap[activeContentTab];
        response = await handleApiCall(
          contentAPI.getContentByStatus(status),
          { context: `Fetching ${activeContentTab.toLowerCase()} content` }
        );
      }
      
      if (response?.data) {
        setContent(response.data);
      } else {
        // Fallback to mock data if API fails
        setContent(mockContent as unknown as ContentItem[]);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      // Fallback to mock data
      setContent(mockContent as unknown as ContentItem[]);
    }
  };
  
  // Filter and sort content items
  const getFilteredContent = () => {
    let filtered = [...content];
    
    // Filter by client if provided and content has clientId
    if (clientId && !activeContentTab.includes('All')) {
      filtered = filtered.filter(item => String(item.clientId) === String(clientId));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query) ||
        item.platform.toLowerCase().includes(query) ||
        item.client.toLowerCase().includes(query)
      );
    }
    
    // Sort the data
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof ContentItem];
        const bValue = b[sortColumn as keyof ContentItem];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // Handle date sorting
        if (sortColumn === 'publishDate' || sortColumn === 'dueDate') {
          const aDate = aValue ? new Date(aValue as string).getTime() : 0;
          const bDate = bValue ? new Date(bValue as string).getTime() : 0;
          return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        return 0;
      });
    }
    
    return filtered;
  };
  
  const filteredContent = getFilteredContent();
  
  // Toggle sort when clicking a column header
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Render sort indicator for column headers
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Delete content handler
  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const response = await handleApiCall(
          contentAPI.deleteContentItem(contentId),
          { context: 'Deleting content item' }
        );
        
        if (response) {
          // Refresh content after deletion
          fetchContent();
        }
      } catch (err) {
        console.error('Error deleting content:', err);
      }
    }
  };
  
  // Update content status handler
  const handleUpdateStatus = async (contentId: string, status: string) => {
    try {
      const response = await handleApiCall(
        contentAPI.updateContentStatus(contentId, status),
        { context: `Updating content status to ${status}` }
      );
      
      if (response) {
        // Refresh content after status update
        fetchContent();
      }
    } catch (err) {
      console.error('Error updating content status:', err);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Content header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Content Management</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchContent()}
            disabled={isLoading}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <RefreshCw 
              size={18}
              className={`${isLoading ? 'animate-spin' : ''} text-gray-500 dark:text-gray-400`}
            />
          </button>
          <button
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => window.location.href = '/dashboard/staff/content/new'}
          >
            <Plus size={18} className="mr-1" />
            New Content
          </button>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <ErrorDisplay
          error={error}
          onDismiss={clearError}
        />
      )}
      
      {/* Content tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="mb-6">
          <TabNavigation
            tabs={["All Content", "Drafts", "Scheduled", "Published"]}
            activeTab={activeContentTab}
            onTabChange={setActiveContentTab}
          />
        </div>
        
        {/* Content search and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="pl-10 pr-3 py-2 w-full sm:w-64 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex items-center">
            <button className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <Filter size={18} className="mr-1 text-gray-500 dark:text-gray-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {/* Content table */}
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                    Title {renderSortIndicator('title')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('type')}>
                    Type {renderSortIndicator('type')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('platform')}>
                    Platform {renderSortIndicator('platform')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell" onClick={() => handleSort('client')}>
                    Client {renderSortIndicator('client')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell" onClick={() => handleSort('publishDate')}>
                    Date {renderSortIndicator('publishDate')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{content.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{content.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{content.platform}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {content.client}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {content.publishDate ? formatDate(content.publishDate) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={content.status} size="md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-1 rounded-full text-blue-600 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => window.location.href = `/dashboard/staff/content/${content.id}`}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-1 rounded-full text-yellow-600 dark:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                          onClick={() => window.location.href = `/dashboard/staff/content/${content.id}/edit`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 rounded-full text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => handleDeleteContent(String(content.id))}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No content found. {searchQuery ? 'Try a different search term.' : activeContentTab !== 'All Content' ? `No ${activeContentTab.toLowerCase()} content available.` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
