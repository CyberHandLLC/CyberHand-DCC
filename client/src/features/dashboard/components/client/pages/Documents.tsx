import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  ChevronRight, 
  Download, 
  Eye,
  FileImage,
  FileSpreadsheet,
  File,
  Folder
} from 'lucide-react';

// Mock data
const mockFolders = [
  { id: 1, name: 'Project Documents', count: 5 },
  { id: 2, name: 'Contracts', count: 3 },
  { id: 3, name: 'Reports', count: 4 },
  { id: 4, name: 'Invoices', count: 2 }
];

const mockDocuments = [
  {
    id: 1,
    name: 'Website Redesign Contract.pdf',
    size: 1240000,
    uploadDate: '2025-01-15T00:00:00Z',
    type: 'pdf',
    folder: 'Contracts',
    sharedBy: 'Jane Smith',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 2,
    name: 'Website Mockups.png',
    size: 3500000,
    uploadDate: '2025-02-05T00:00:00Z',
    type: 'image',
    folder: 'Project Documents',
    sharedBy: 'Mike Johnson',
    sharedByAvatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 3,
    name: 'SEO Strategy.pdf',
    size: 890000,
    uploadDate: '2025-02-10T00:00:00Z',
    type: 'pdf',
    folder: 'Project Documents',
    sharedBy: 'Alex Turner',
    sharedByAvatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 4,
    name: 'Monthly Analytics Report - January.xlsx',
    size: 540000,
    uploadDate: '2025-02-01T00:00:00Z',
    type: 'spreadsheet',
    folder: 'Reports',
    sharedBy: 'Emily Wilson',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 5,
    name: 'Monthly Analytics Report - February.xlsx',
    size: 620000,
    uploadDate: '2025-03-01T00:00:00Z',
    type: 'spreadsheet',
    folder: 'Reports',
    sharedBy: 'Emily Wilson',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 6,
    name: 'Invoice #1001.pdf',
    size: 320000,
    uploadDate: '2025-01-20T00:00:00Z',
    type: 'pdf',
    folder: 'Invoices',
    sharedBy: 'Jane Smith',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 7,
    name: 'Brand Guidelines.pdf',
    size: 1800000,
    uploadDate: '2025-01-25T00:00:00Z',
    type: 'pdf',
    folder: 'Project Documents',
    sharedBy: 'Mike Johnson',
    sharedByAvatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 8,
    name: 'Content Calendar.xlsx',
    size: 480000,
    uploadDate: '2025-02-15T00:00:00Z',
    type: 'spreadsheet',
    folder: 'Project Documents',
    sharedBy: 'Sarah Davis',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 9,
    name: 'Invoice #1002.pdf',
    size: 350000,
    uploadDate: '2025-02-20T00:00:00Z',
    type: 'pdf',
    folder: 'Invoices',
    sharedBy: 'Jane Smith',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 10,
    name: 'Keyword Analysis.xlsx',
    size: 750000,
    uploadDate: '2025-02-25T00:00:00Z',
    type: 'spreadsheet',
    folder: 'Reports',
    sharedBy: 'Alex Turner',
    sharedByAvatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 11,
    name: 'Social Media Strategy.pdf',
    size: 920000,
    uploadDate: '2025-03-05T00:00:00Z',
    type: 'pdf',
    folder: 'Project Documents',
    sharedBy: 'Rachel Green',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    id: 12,
    name: 'Competitor Analysis.pdf',
    size: 1100000,
    uploadDate: '2025-03-10T00:00:00Z',
    type: 'pdf',
    folder: 'Reports',
    sharedBy: 'Alex Turner',
    sharedByAvatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 13,
    name: 'Service Agreement.pdf',
    size: 980000,
    uploadDate: '2025-01-10T00:00:00Z',
    type: 'pdf',
    folder: 'Contracts',
    sharedBy: 'Jane Smith',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 14,
    name: 'Project Timeline.xlsx',
    size: 420000,
    uploadDate: '2025-01-30T00:00:00Z',
    type: 'spreadsheet',
    folder: 'Project Documents',
    sharedBy: 'Jane Smith',
    sharedByAvatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  }
];

interface DocumentsProps {
  theme: 'light' | 'dark';
}

const Documents: React.FC<DocumentsProps> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className={`h-5 w-5 ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`} />;
      case 'image':
        return <FileImage className={`h-5 w-5 ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} />;
      case 'spreadsheet':
        return <FileSpreadsheet className={`h-5 w-5 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} />;
      default:
        return <File className={`h-5 w-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />;
    }
  };
  
  // Filter documents based on search term, type filter, and selected folder
  const filteredDocuments = mockDocuments.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    const matchesFolder = selectedFolder === null || document.folder === selectedFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className={`text-xl font-semibold mb-4 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Documents
        </h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Type filter */}
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Filter className="h-4 w-4" />
            </div>
            <select
              className={`pl-10 pr-4 py-2 text-sm rounded-md appearance-none w-full md:w-auto ${
                theme === 'light' 
                  ? 'bg-white border border-gray-300 focus:ring-teal-500 focus:border-teal-500 text-gray-700' 
                  : 'bg-[#1e2a45] border border-[#2a3448] focus:ring-teal-400 focus:border-teal-400 text-gray-300'
              }`}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
              <option value="spreadsheet">Spreadsheets</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronRight className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders sidebar */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Folders
              </h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1e2a45] ${
                    selectedFolder === null ? 
                      (theme === 'light' ? 'bg-gray-50 border-l-4 border-teal-500' : 'bg-[#1e2a45] border-l-4 border-teal-400') : 
                      ''
                  }`}
                >
                  <div className="flex items-center">
                    <Folder className={`h-5 w-5 ${theme === 'light' ? 'text-teal-500' : 'text-teal-400'}`} />
                    <span className={`ml-3 text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      All Documents
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
                    {mockDocuments.length}
                  </span>
                </button>
              </li>
              {mockFolders.map(folder => (
                <li key={folder.id}>
                  <button
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1e2a45] ${
                      selectedFolder === folder.name ? 
                        (theme === 'light' ? 'bg-gray-50 border-l-4 border-teal-500' : 'bg-[#1e2a45] border-l-4 border-teal-400') : 
                        ''
                    }`}
                  >
                    <div className="flex items-center">
                      <Folder className={`h-5 w-5 ${theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'}`} />
                      <span className={`ml-3 text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {folder.name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
                      {folder.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Documents list */}
        <div className="lg:col-span-3">
          <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {selectedFolder || 'All Documents'}
              </h2>
              <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {filteredDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Shared By
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${theme === 'light' ? 'bg-white' : 'bg-[#162238]'}`}>
                    {filteredDocuments.map(document => (
                      <tr key={document.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(document.type)}
                            <div className="ml-3">
                              <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {document.name}
                              </div>
                              <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {document.folder}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            document.type === 'pdf' ? 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            document.type === 'image' ?
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            document.type === 'spreadsheet' ?
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatFileSize(document.size)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(document.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-6 w-6 rounded-full"
                              src={document.sharedByAvatar}
                              alt={document.sharedBy}
                            />
                            <div className={`ml-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              {document.sharedBy}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              className={`p-1.5 rounded-full ${
                                theme === 'light' 
                                  ? 'hover:bg-gray-100 text-gray-700' 
                                  : 'hover:bg-gray-700 text-gray-300'
                              }`}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className={`p-1.5 rounded-full ${
                                theme === 'light' 
                                  ? 'hover:bg-gray-100 text-gray-700' 
                                  : 'hover:bg-gray-700 text-gray-300'
                              }`}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`py-12 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                No documents found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
