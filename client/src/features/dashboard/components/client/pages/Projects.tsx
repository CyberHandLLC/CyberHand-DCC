import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  Circle,
  ArrowUpRight,
  ChevronRight,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import API services
import projectAPI, { Project } from '../../../../../api/services/projectAPI';

// Import custom hooks
import useApiError from '../../../../../hooks/useApiError';

// Import shared components
import ErrorDisplay from '../../../../../components/ui/ErrorDisplay';
import LoadingState from '../../../../../components/ui/LoadingState';

// Mock data for fallback
const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 65,
    startDate: '2025-01-15T00:00:00Z',
    dueDate: '2025-04-10T00:00:00Z',
    description: 'Complete overhaul of company website with new design and improved functionality',
    tasks: [
      { id: 101, name: 'Design homepage mockup', status: 'Completed', dueDate: '2025-02-01T00:00:00Z' },
      { id: 102, name: 'Develop responsive templates', status: 'In Progress', dueDate: '2025-03-15T00:00:00Z' },
      { id: 103, name: 'Content migration', status: 'Not Started', dueDate: '2025-03-30T00:00:00Z' },
      { id: 104, name: 'Testing and QA', status: 'Not Started', dueDate: '2025-04-05T00:00:00Z' }
    ],
    team: [
      { id: 201, name: 'Jane Smith', role: 'Project Manager', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 202, name: 'Mike Johnson', role: 'Designer', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { id: 203, name: 'Sarah Davis', role: 'Developer', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }
    ],
    documents: [
      { id: 301, name: 'Project Brief.pdf', type: 'PDF', uploadDate: '2025-01-17T00:00:00Z' },
      { id: 302, name: 'Wireframes.sketch', type: 'Sketch', uploadDate: '2025-02-05T00:00:00Z' },
      { id: 303, name: 'Content Inventory.xlsx', type: 'Excel', uploadDate: '2025-02-20T00:00:00Z' }
    ]
  },
  {
    id: 2,
    name: 'SEO Optimization',
    status: 'In Progress',
    progress: 30,
    startDate: '2025-02-01T00:00:00Z',
    dueDate: '2025-05-15T00:00:00Z',
    description: 'Comprehensive SEO optimization to improve search engine rankings and organic traffic',
    tasks: [
      { id: 201, name: 'SEO audit', status: 'Completed', dueDate: '2025-02-15T00:00:00Z' },
      { id: 202, name: 'Keyword research', status: 'Completed', dueDate: '2025-03-01T00:00:00Z' },
      { id: 203, name: 'On-page optimization', status: 'In Progress', dueDate: '2025-04-15T00:00:00Z' },
      { id: 204, name: 'Content enhancement', status: 'Not Started', dueDate: '2025-05-01T00:00:00Z' }
    ],
    team: [
      { id: 301, name: 'Alex Turner', role: 'SEO Specialist', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
      { id: 302, name: 'Emily Wilson', role: 'Content Writer', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' }
    ],
    documents: [
      { id: 401, name: 'SEO Strategy.pdf', type: 'PDF', uploadDate: '2025-02-05T00:00:00Z' },
      { id: 402, name: 'Keyword Analysis.xlsx', type: 'Excel', uploadDate: '2025-03-10T00:00:00Z' }
    ]
  },
  {
    id: 3,
    name: 'Social Media Campaign',
    status: 'Not Started',
    progress: 0,
    startDate: '2025-06-01T00:00:00Z',
    dueDate: '2025-08-31T00:00:00Z',
    description: 'Social media marketing campaign across multiple platforms to increase brand awareness',
    tasks: [
      { id: 301, name: 'Campaign strategy', status: 'Not Started', dueDate: '2025-06-15T00:00:00Z' },
      { id: 302, name: 'Content creation', status: 'Not Started', dueDate: '2025-07-15T00:00:00Z' },
      { id: 303, name: 'Campaign execution', status: 'Not Started', dueDate: '2025-08-15T00:00:00Z' },
      { id: 304, name: 'Performance analysis', status: 'Not Started', dueDate: '2025-08-31T00:00:00Z' }
    ],
    team: [
      { id: 401, name: 'Rachel Green', role: 'Social Media Manager', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' }
    ],
    documents: []
  }
];

interface ProjectsProps {
  theme: 'light' | 'dark';
}

const Projects: React.FC<ProjectsProps> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Error handling hook
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);
  
  // Fetch projects based on status filter
  const fetchProjects = async () => {
    try {
      let response;
      
      if (statusFilter === 'all') {
        response = await handleApiCall(
          projectAPI.getAllProjects(),
          { context: 'Fetching all projects' }
        );
      } else {
        const statusMap: Record<string, string> = {
          'inprogress': 'In Progress',
          'completed': 'Completed',
          'notstarted': 'Not Started'
        };
        
        const status = statusMap[statusFilter];
        response = await handleApiCall(
          projectAPI.getProjectsByStatus(status),
          { context: `Fetching ${status} projects` }
        );
      }
      
      if (response?.data) {
        setProjects(response.data);
      } else {
        // Fallback to mock data if API fails
        setProjects(mockProjects as Project[]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Fallback to mock data
      setProjects(mockProjects as Project[]);
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Get appropriate icon for task status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'Not Started':
        return <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    return project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           project.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className={`text-xl font-semibold mb-4 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Your Projects
        </h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Refresh button */}
          <button
            onClick={fetchProjects}
            disabled={isLoading}
            className={`p-2 rounded-md ${theme === 'light' ? 'bg-white border border-gray-300' : 'bg-[#1e2a45] border border-[#2a3448]'}`}
          >
            <RefreshCw 
              size={16} 
              className={`${isLoading ? 'animate-spin' : ''} ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
            />
          </button>
          
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="notstarted">Not Started</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronRight className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
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
      {isLoading ? (
        <LoadingState 
          message="Loading projects..." 
          theme={theme}
        />
      ) : (
        /* Project list */
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div 
                key={project.id} 
                className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                          {project.name}
                        </h2>
                        <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {project.description}
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/client/projects/${project.id}`}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                        theme === 'light'
                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          : 'bg-teal-900 bg-opacity-30 text-teal-400 hover:bg-opacity-40'
                      }`}
                    >
                      View Details
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Progress
                      </span>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {project.progress}%
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700`}>
                      <div
                        className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className={`flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        {formatDate(project.startDate)} - {formatDate(project.dueDate)}
                      </span>
                    </div>
                    <div className={`flex items-center justify-end ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      <FileText className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        {project.documents.length} Documents
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Recent Tasks
                    </h3>
                    <ul className={`divide-y ${theme === 'light' ? 'divide-gray-100' : 'divide-gray-800'}`}>
                      {project.tasks.slice(0, 3).map(task => (
                        <li key={task.id} className="py-2 flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon(task.status)}
                            <span className={`ml-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                              {task.name}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Due {formatDate(task.dueDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {project.tasks.length > 3 && (
                      <button 
                        className={`mt-2 text-xs font-medium flex items-center ${
                          theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'
                        }`}
                      >
                        View all tasks
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {searchTerm ? 'No projects match your search.' : 'No projects found.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
