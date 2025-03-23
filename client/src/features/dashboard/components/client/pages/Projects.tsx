import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
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
  
  // Filter projects based on search term and status filter
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status.replace(' ', '').toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className={`text-xl font-semibold mb-4 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Your Projects
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
      
      {/* Project list */}
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
                    <p className={`mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {project.description}
                    </p>
                    <div className={`mt-2 flex items-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(project.startDate)} - {formatDate(project.dueDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center">
                      <span className={`text-sm mr-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {project.progress}%
                      </span>
                      <div className="w-28 md:w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          style={{ width: `${project.progress}%` }} 
                          className={`h-full rounded-full ${
                            project.progress >= 75 ? 'bg-green-500 dark:bg-green-400' :
                            project.progress >= 40 ? 'bg-blue-500 dark:bg-blue-400' :
                            project.progress >= 1 ? 'bg-yellow-500 dark:bg-yellow-400' :
                            'bg-gray-400 dark:bg-gray-600'
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={`/dashboard/client/projects/${project.id}`}
                        className={`text-sm font-medium px-4 py-2 rounded-md ${
                          theme === 'light'
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                            : 'bg-teal-900/30 text-teal-400 hover:bg-teal-900/50'
                        }`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}>
                    <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Tasks
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium">
                          {project.tasks.filter(task => task.status === 'Completed').length}
                        </span>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium">
                          {project.tasks.filter(task => task.status === 'In Progress').length}
                        </span>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium">
                          {project.tasks.filter(task => task.status === 'Not Started').length}
                        </span>
                      </div>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {project.tasks.filter(task => task.status === 'Completed').length}/{project.tasks.length} completed
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}>
                    <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Team
                    </h3>
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.team.map((member, index) => (
                        <div 
                          key={member.id} 
                          className={`inline-block h-8 w-8 rounded-full ring-2 ${
                            theme === 'light' ? 'ring-white' : 'ring-[#162238]'
                          }`}
                          title={`${member.name} (${member.role})`}
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </div>
                      ))}
                      {project.team.length > 0 && (
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                          theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-200'
                        } text-xs font-medium`}>
                          {project.team.length}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1e2a45]'}`}>
                    <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Documents
                    </h3>
                    {project.documents.length > 0 ? (
                      <div className="flex items-center">
                        <FileText className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {project.documents.length} document{project.documents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        No documents yet
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Upcoming task preview */}
                {project.status !== 'Completed' && project.tasks.some(task => task.status !== 'Completed') && (
                  <div className="mt-6">
                    <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Next Task
                    </h3>
                    {project.tasks.find(task => task.status !== 'Completed') && (
                      (() => {
                        const nextTask = project.tasks.find(task => task.status !== 'Completed');
                        return (
                          <div className={`p-4 rounded-md ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1e2a45] border border-[#2a3448]'}`}>
                            <div className="flex items-start">
                              {getStatusIcon(nextTask?.status || '')}
                              <div className="ml-2">
                                <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                  {nextTask?.name}
                                </p>
                                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                  Due {formatDate(nextTask?.dueDate || '')}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            No projects found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
