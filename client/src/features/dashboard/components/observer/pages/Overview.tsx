import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle,
  FileText,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  CheckSquare
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
  monthlyVisits: 4582,
  monthlyVisitsChange: 12.5,
  totalLeadsMonth: 28,
  totalLeadsLastMonth: 22,
  conversionsMonth: 5,
  conversionsLastMonth: 4
};

const mockUpcomingEvents = [
  { id: 1, title: 'Monthly Progress Review', date: '2025-03-25T14:00:00Z', type: 'Meeting' },
  { id: 2, title: 'Website Launch Planning', date: '2025-04-02T10:30:00Z', type: 'Meeting' },
  { id: 3, title: 'Content Calendar Deadline', date: '2025-03-31T00:00:00Z', type: 'Deadline' }
];

const mockRecentActivity = [
  { id: 1, type: 'update', description: 'Website mockups approved', date: '2025-03-18T09:30:00Z' },
  { id: 2, type: 'message', description: 'New message in SEO Optimization ticket', date: '2025-03-17T14:45:00Z' },
  { id: 3, type: 'file', description: 'Analytics Report uploaded', date: '2025-03-15T11:20:00Z' },
  { id: 4, type: 'task', description: 'Keyword research task completed', date: '2025-03-12T16:10:00Z' },
  { id: 5, type: 'update', description: 'Social media strategy updated', date: '2025-03-10T10:05:00Z' }
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

  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Get appropriate icon for task status
  const getTaskStatusIcon = (status: string) => {
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

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'file':
        return <FileText className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-teal-500 dark:text-teal-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-5">
        <h1 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Account Overview</h1>
        <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-300'}`}>
          <Eye className="h-3 w-3 inline-block mr-1" />
          Observer Mode
        </span>
      </div>

      {/* Notice banner for observer */}
      <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-800'}`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`}>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
              Observer Access Only
            </h3>
            <div className={`mt-2 text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'}`}>
              <p>
                You are viewing this dashboard in observer mode. You can view information but cannot make changes or interact with projects.
                If you need to make changes, please contact an administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project status */}
        <div className={`lg:col-span-2 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Projects</h2>
            <Link 
              to="/dashboard/observer/projects"
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
                    to={`/dashboard/observer/projects/${project.id}`}
                    className={`text-sm font-medium ${theme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`}
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Upcoming events */}
          <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Upcoming Events</h2>
            </div>
            <div className="p-6">
              {mockUpcomingEvents.length > 0 ? (
                <ul className={`rounded-md overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#2a3448]'}`}>
                  {mockUpcomingEvents.map((event, index) => (
                    <li 
                      key={event.id} 
                      className={`px-4 py-3 ${index !== mockUpcomingEvents.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-[#1e2a45]'}`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
                          <Calendar className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{event.title}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {formatDateTime(event.date)}
                            </span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                              event.type === 'Meeting' ? 
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`text-center py-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No upcoming events
                </div>
              )}
            </div>
          </div>
          
          {/* Recent activity */}
          <div className={`rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#162238] border-[#2a3448]'}`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Recent Activity</h2>
            </div>
            <div className="p-6">
              {mockRecentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {mockRecentActivity.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== mockRecentActivity.length - 1 && (
                            <span 
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" 
                              aria-hidden="true"
                            ></span>
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ${
                                theme === 'light' ? 
                                  'bg-white ring-white' : 
                                  'bg-[#1e2a45] ring-[#162238]'
                              }`}>
                                {getActivityIcon(activity.type)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                  {activity.description}
                                </p>
                              </div>
                              <div className={`text-right text-xs whitespace-nowrap ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatDateTime(activity.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className={`text-center py-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
