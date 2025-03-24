import React from 'react';
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart,
  CheckSquare,
  Circle,
  File
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 65,
    dueDate: '2025-04-10T00:00:00Z',
    tasks: [
      { id: 101, name: 'Design homepage mockup', status: 'Completed' },
      { id: 102, name: 'Develop responsive templates', status: 'In Progress' },
      { id: 103, name: 'Content migration', status: 'Not Started' },
      { id: 104, name: 'Testing and QA', status: 'Not Started' }
    ]
  },
  {
    id: 2,
    name: 'SEO Optimization',
    status: 'In Progress',
    progress: 30,
    dueDate: '2025-05-15T00:00:00Z',
    tasks: [
      { id: 201, name: 'SEO audit', status: 'Completed' },
      { id: 202, name: 'Keyword research', status: 'Completed' },
      { id: 203, name: 'On-page optimization', status: 'In Progress' },
      { id: 204, name: 'Content enhancement', status: 'Not Started' }
    ]
  }
];

const mockMetrics = {
  activeProjects: 2,
  completedProjects: 3,
  activeServices: 4,
  openTickets: 1,
  upcomingMeetings: 2,
  monthlyVisitsChange: 12.5,
  monthlyVisits: 4582,
  totalLeadsMonth: 28,
  totalLeadsLastMonth: 22,
  conversionsMonth: 5,
  conversionsLastMonth: 4
};

const mockRecentDocuments = [
  { id: 1, name: 'Website Project Proposal', type: 'PDF', date: '2025-03-18T00:00:00Z' },
  { id: 2, name: 'SEO Strategy Document', type: 'DOCX', date: '2025-03-10T00:00:00Z' },
  { id: 3, name: 'Content Calendar Q2', type: 'XLSX', date: '2025-03-05T00:00:00Z' },
  { id: 4, name: 'Analytics Report - March', type: 'PDF', date: '2025-03-01T00:00:00Z' }
];

interface OverviewProps {
  theme: 'light' | 'dark';
}

const Overview: React.FC<OverviewProps> = ({ theme }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get appropriate icon for task status
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'At Risk':
        return <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      case 'Not Started':
        return <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return <File className="h-4 w-4 text-red-500" />;
      case 'DOCX':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'XLSX':
        return <File className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <h1 className={`text-xl font-semibold mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Dashboard Overview</h1>
      
      {/* Metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg border p-4 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Active Projects</p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{mockMetrics.activeProjects}</h3>
            </div>
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-teal-100' : 'bg-teal-900'}`}>
              <BarChart2 className={`h-5 w-5 ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {mockMetrics.completedProjects} completed
            </span>
          </div>
        </div>
        
        <div className={`rounded-lg border p-4 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Website Traffic</p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{mockMetrics.monthlyVisits.toLocaleString()}</h3>
            </div>
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
              <TrendingUp className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            {mockMetrics.monthlyVisitsChange > 0 ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+{mockMetrics.monthlyVisitsChange}% vs last month</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs font-medium text-red-500">{mockMetrics.monthlyVisitsChange}% vs last month</span>
              </>
            )}
          </div>
        </div>
        
        <div className={`rounded-lg border p-4 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Generated Leads</p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{mockMetrics.totalLeadsMonth}</h3>
            </div>
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900'}`}>
              <PieChart className={`h-5 w-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            {mockMetrics.totalLeadsMonth > mockMetrics.totalLeadsLastMonth ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">
                  +{((mockMetrics.totalLeadsMonth - mockMetrics.totalLeadsLastMonth) / mockMetrics.totalLeadsLastMonth * 100).toFixed(1)}% vs last month
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs font-medium text-red-500">
                  {((mockMetrics.totalLeadsMonth - mockMetrics.totalLeadsLastMonth) / mockMetrics.totalLeadsLastMonth * 100).toFixed(1)}% vs last month
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className={`rounded-lg border p-4 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Conversions</p>
              <h3 className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{mockMetrics.conversionsMonth}</h3>
            </div>
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-green-100' : 'bg-green-900'}`}>
              <CheckSquare className={`h-5 w-5 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            {mockMetrics.conversionsMonth > mockMetrics.conversionsLastMonth ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">
                  +{((mockMetrics.conversionsMonth - mockMetrics.conversionsLastMonth) / mockMetrics.conversionsLastMonth * 100).toFixed(1)}% vs last month
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs font-medium text-red-500">
                  {((mockMetrics.conversionsMonth - mockMetrics.conversionsLastMonth) / mockMetrics.conversionsLastMonth * 100).toFixed(1)}% vs last month
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className={`rounded-lg border mb-6 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link 
            to="/dashboard/client/support" 
            className={`flex items-center p-4 rounded-lg border transition-all ${theme === 'light' ? 
              'bg-white border-gray-200 hover:bg-gray-50' : 
              'bg-[#1e2a45] border-[#2a3448] hover:bg-[#253552]'}`}
          >
            <div className={`p-2 rounded-full mr-4 ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
              <MessageCircle className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
            <div>
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Support</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{mockMetrics.openTickets} open ticket{mockMetrics.openTickets !== 1 ? 's' : ''}</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/client/projects" 
            className={`flex items-center p-4 rounded-lg border transition-all ${theme === 'light' ? 
              'bg-white border-gray-200 hover:bg-gray-50' : 
              'bg-[#1e2a45] border-[#2a3448] hover:bg-[#253552]'}`}
          >
            <div className={`p-2 rounded-full mr-4 ${theme === 'light' ? 'bg-teal-100' : 'bg-teal-900'}`}>
              <CheckSquare className={`h-5 w-5 ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`} />
            </div>
            <div>
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Projects</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{mockProjects.length} active project{mockProjects.length !== 1 ? 's' : ''}</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/client/calendar" 
            className={`flex items-center p-4 rounded-lg border transition-all ${theme === 'light' ? 
              'bg-white border-gray-200 hover:bg-gray-50' : 
              'bg-[#1e2a45] border-[#2a3448] hover:bg-[#253552]'}`}
          >
            <div className={`p-2 rounded-full mr-4 ${theme === 'light' ? 'bg-orange-100' : 'bg-orange-900'}`}>
              <Calendar className={`h-5 w-5 ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} />
            </div>
            <div>
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Calendar</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{mockMetrics.upcomingMeetings} upcoming meeting{mockMetrics.upcomingMeetings !== 1 ? 's' : ''}</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/client/documents" 
            className={`flex items-center p-4 rounded-lg border transition-all ${theme === 'light' ? 
              'bg-white border-gray-200 hover:bg-gray-50' : 
              'bg-[#1e2a45] border-[#2a3448] hover:bg-[#253552]'}`}
          >
            <div className={`p-2 rounded-full mr-4 ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900'}`}>
              <FileText className={`h-5 w-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
            </div>
            <div>
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Documents</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{mockRecentDocuments.length} recent file{mockRecentDocuments.length !== 1 ? 's' : ''}</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project status */}
        <div className={`lg:col-span-2 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Projects</h2>
            <Link 
              to="/dashboard/client/projects"
              className={`text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`}
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockProjects.map((project) => (
              <div key={project.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {project.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Due {formatDate(project.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <div className="flex items-center">
                      <span className={`text-sm mr-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{project.progress}%</span>
                      <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          style={{ width: `${project.progress}%` }} 
                          className={`h-full rounded-full ${
                            project.progress >= 75 ? 'bg-green-500 dark:bg-green-400' :
                            project.progress >= 40 ? 'bg-blue-500 dark:bg-blue-400' :
                            'bg-yellow-500 dark:bg-yellow-400'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-md overflow-hidden border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1e2a45] border-[#2a3448]'}`}>
                  <div className="px-4 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                    Recent Tasks
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {project.tasks.slice(0, 3).map((task) => (
                      <li key={task.id} className="px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center">
                          {getTaskStatusIcon(task.status)}
                          <span className={`ml-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            {task.name}
                          </span>
                        </div>
                        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                          task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          task.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/dashboard/client/projects/${project.id}`}
                    className={`text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`}
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent documents and files */}
        <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Recent Documents</h2>
            <Link 
              to="/dashboard/client/documents"
              className={`text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`}
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <ul className={`rounded-md overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
              {mockRecentDocuments.map((doc, index) => (
                <li 
                  key={doc.id} 
                  className={`flex items-center px-4 py-3 ${index !== mockRecentDocuments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}
                >
                  <div className={`flex-shrink-0 p-2 rounded-md ${theme === 'light' ? 'bg-gray-100' : 'bg-[#253552]'}`}>
                    {getFileTypeIcon(doc.type)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <Link 
                      to={`/dashboard/client/documents/${doc.id}`}
                      className={`truncate text-sm font-medium ${theme === 'light' ? 'text-gray-900 hover:text-gray-700' : 'text-white hover:text-gray-300'}`}
                    >
                      {doc.name}
                    </Link>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {doc.type} · {formatDate(doc.date)}
                    </p>
                  </div>
                  <button 
                    className={`ml-2 p-1.5 rounded-md ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#253552]'}`}
                    aria-label="Download document"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <button 
                className={`w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none ${
                  theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#1e2a45] border-[#2a3448] text-gray-300 hover:bg-[#253552]'
                }`}
              >
                Upload New Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
