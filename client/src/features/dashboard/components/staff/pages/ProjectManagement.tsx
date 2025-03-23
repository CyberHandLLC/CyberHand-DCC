import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, Circle, XCircle, AlertCircle, Calendar, CheckSquare, ChevronDown, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock project data
const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'Johnson Media',
    clientId: 3,
    description: 'Complete website redesign with new branding and responsive layout',
    startDate: '2025-02-15T00:00:00Z',
    dueDate: '2025-04-10T00:00:00Z',
    status: 'In Progress',
    progress: 65,
    assignedTo: 'Emily Rodriguez',
    tasks: [
      { id: 101, name: 'Design homepage mockup', status: 'Completed', dueDate: '2025-02-28T00:00:00Z' },
      { id: 102, name: 'Develop responsive templates', status: 'In Progress', dueDate: '2025-03-20T00:00:00Z' },
      { id: 103, name: 'Content migration', status: 'Not Started', dueDate: '2025-04-01T00:00:00Z' },
      { id: 104, name: 'Testing and QA', status: 'Not Started', dueDate: '2025-04-08T00:00:00Z' }
    ]
  },
  {
    id: 2,
    name: 'SEO Optimization',
    client: 'Chen Technologies',
    clientId: 4,
    description: 'Improve search engine rankings and site performance',
    startDate: '2025-03-01T00:00:00Z',
    dueDate: '2025-05-15T00:00:00Z',
    status: 'In Progress',
    progress: 30,
    assignedTo: 'Emily Rodriguez',
    tasks: [
      { id: 201, name: 'SEO audit', status: 'Completed', dueDate: '2025-03-10T00:00:00Z' },
      { id: 202, name: 'Keyword research', status: 'Completed', dueDate: '2025-03-15T00:00:00Z' },
      { id: 203, name: 'On-page optimization', status: 'In Progress', dueDate: '2025-04-15T00:00:00Z' },
      { id: 204, name: 'Content enhancement', status: 'Not Started', dueDate: '2025-05-01T00:00:00Z' },
      { id: 205, name: 'Final report', status: 'Not Started', dueDate: '2025-05-10T00:00:00Z' }
    ]
  },
  {
    id: 3,
    name: 'Email Marketing Campaign',
    client: 'Rivera Design',
    clientId: 5,
    description: 'Design and implement quarterly email marketing campaign',
    startDate: '2025-03-15T00:00:00Z',
    dueDate: '2025-04-30T00:00:00Z',
    status: 'At Risk',
    progress: 20,
    assignedTo: 'Emily Rodriguez',
    tasks: [
      { id: 301, name: 'Campaign strategy', status: 'Completed', dueDate: '2025-03-25T00:00:00Z' },
      { id: 302, name: 'Design email templates', status: 'In Progress', dueDate: '2025-04-05T00:00:00Z' },
      { id: 303, name: 'Content creation', status: 'Not Started', dueDate: '2025-04-15T00:00:00Z' },
      { id: 304, name: 'Segmentation setup', status: 'Not Started', dueDate: '2025-04-20T00:00:00Z' },
      { id: 305, name: 'Test sends', status: 'Not Started', dueDate: '2025-04-25T00:00:00Z' }
    ]
  },
  {
    id: 4,
    name: 'Social Media Strategy',
    client: 'Thompson Consulting',
    clientId: 1,
    description: 'Develop comprehensive social media strategy and content calendar',
    startDate: '2025-02-01T00:00:00Z',
    dueDate: '2025-03-15T00:00:00Z',
    status: 'Completed',
    progress: 100,
    assignedTo: 'Emily Rodriguez',
    tasks: [
      { id: 401, name: 'Platform audit', status: 'Completed', dueDate: '2025-02-10T00:00:00Z' },
      { id: 402, name: 'Strategy document', status: 'Completed', dueDate: '2025-02-25T00:00:00Z' },
      { id: 403, name: 'Content calendar', status: 'Completed', dueDate: '2025-03-05T00:00:00Z' },
      { id: 404, name: 'Client presentation', status: 'Completed', dueDate: '2025-03-15T00:00:00Z' }
    ]
  },
  {
    id: 5,
    name: 'AI Chatbot Integration',
    client: 'Garcia & Partners',
    clientId: 2,
    description: 'Implement and train AI chatbot for customer service portal',
    startDate: '2025-03-10T00:00:00Z',
    dueDate: '2025-06-30T00:00:00Z',
    status: 'In Progress',
    progress: 10,
    assignedTo: 'Emily Rodriguez',
    tasks: [
      { id: 501, name: 'Requirements gathering', status: 'Completed', dueDate: '2025-03-25T00:00:00Z' },
      { id: 502, name: 'Platform selection', status: 'In Progress', dueDate: '2025-04-10T00:00:00Z' },
      { id: 503, name: 'Initial configuration', status: 'Not Started', dueDate: '2025-05-01T00:00:00Z' },
      { id: 504, name: 'Training data preparation', status: 'Not Started', dueDate: '2025-05-20T00:00:00Z' },
      { id: 505, name: 'Model training', status: 'Not Started', dueDate: '2025-06-10T00:00:00Z' },
      { id: 506, name: 'Testing and deployment', status: 'Not Started', dueDate: '2025-06-25T00:00:00Z' }
    ]
  }
];

interface ProjectManagementProps {
  theme: 'light' | 'dark';
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  // Filter projects based on search and status
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get appropriate CSS class for project status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get appropriate CSS class and icon for task status
  const getTaskStatusInfo = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
          textClass: 'text-green-600 dark:text-green-400'
        };
      case 'In Progress':
        return {
          icon: <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
          textClass: 'text-blue-600 dark:text-blue-400'
        };
      case 'At Risk':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
          textClass: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'Delayed':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
          textClass: 'text-red-600 dark:text-red-400'
        };
      case 'Not Started':
        return {
          icon: <Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
          textClass: 'text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          icon: <Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
          textClass: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
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
        class: diffDays <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <h1 className={`text-xl font-semibold mb-3 md:mb-0 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Project Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={`relative flex items-center ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#182032] border-[#2a3448]'} border rounded-md`}>
            <Search className="h-4 w-4 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
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
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'In Progress' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('In Progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Completed' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'At Risk' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('At Risk')}
                  >
                    At Risk
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'Not Started' ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''}`}
                    onClick={() => setStatusFilter('Not Started')}
                  >
                    Not Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const dueDateInfo = getDueDateInfo(project.dueDate);
          
          return (
            <div 
              key={project.id} 
              className={`rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}
            >
              {/* Project header */}
              <div 
                className={`px-6 py-4 ${theme === 'light' ? 'bg-white hover:bg-gray-50' : 'bg-[#162238] hover:bg-[#1e2a45]'} cursor-pointer`}
                onClick={() => toggleProjectExpansion(project.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {project.name}
                      </h3>
                      <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center">
                      <Link 
                        to={`/dashboard/staff/client-management/${project.clientId}`}
                        className={`text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.client}
                      </Link>
                    </div>
                    
                    <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Progress</div>
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 dark:bg-teal-400 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{project.progress}%</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</div>
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatDate(project.dueDate)}</div>
                      <div className={`text-xs ${dueDateInfo.class}`}>{dueDateInfo.text}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded project details */}
              {isExpanded && (
                <div className={`px-6 py-4 border-t ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1e2a45] border-[#2a3448]'}`}>
                  <div className="mb-4">
                    <h4 className={`text-md font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Project Details</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Start Date</div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatDate(project.startDate)}</div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{project.assignedTo}</div>
                      </div>
                      
                      <div>
                        <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Tasks</div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {project.tasks.filter(task => task.status === 'Completed').length} of {project.tasks.length} completed
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-md font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Tasks</h4>
                      
                      <div className="flex items-center">
                        <button className={`text-sm px-3 py-1 rounded-md ${theme === 'light' ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' : 'bg-teal-900 text-teal-300 hover:bg-teal-800'}`}>
                          Add Task
                        </button>
                      </div>
                    </div>
                    
                    <div className={`rounded-md overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-[#12192e]'}>
                          <tr>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Task
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Status
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Due Date
                            </th>
                            <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`${theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-[#162238] divide-y divide-[#2a3448]'}`}>
                          {project.tasks.map((task) => {
                            const taskStatusInfo = getTaskStatusInfo(task.status);
                            const taskDueDateInfo = getDueDateInfo(task.dueDate);
                            
                            return (
                              <tr key={task.id} className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {task.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {taskStatusInfo.icon}
                                    <span className={`ml-2 text-sm ${taskStatusInfo.textClass}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {formatDate(task.dueDate)}
                                  </div>
                                  <div className={`text-xs ${taskDueDateInfo.class}`}>
                                    {taskDueDateInfo.text}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button 
                                      className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-teal-600' : 'hover:bg-[#253552] text-teal-400'}`}
                                      title="Mark as Complete"
                                    >
                                      <CheckSquare className="h-5 w-5" />
                                    </button>
                                    <button 
                                      className={`p-1 rounded ${theme === 'light' ? 'hover:bg-gray-100 text-blue-600' : 'hover:bg-[#253552] text-blue-400'}`}
                                      title="View Task Details"
                                    >
                                      <Calendar className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button className={`mr-2 px-4 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#253552] text-gray-300 hover:bg-[#2a3448]'}`}>
                      Log Time
                    </button>
                    <button className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                      View Full Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredProjects.length === 0 && (
          <div className={`py-10 text-center ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-lg`}>
            <div className={`text-lg font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              No projects found
            </div>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
