import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  CalendarClock,
  User, 
  Sun, 
  Moon,
  X, 
  ChevronDown,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Loader,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { User as UserType } from '../../../../types/user';
import useClickOutside from '../../../../hooks/useClickOutside';
import useDashboardNavigation from '../../../../hooks/useDashboardNavigation';
import useApiError from '../../../../hooks/useApiError';
import ErrorDisplay from '../../../../components/ui/ErrorDisplay';
import { useTheme } from '../../../../context/ThemeContext';
import Icon from '../../../../components/ui/Icon';
import Card from '../../../../components/ui/Card';
import MetricCard from '../../../../components/ui/MetricCard';

interface StaffDashboardContentProps {
  user: UserType;
}

// Mock data for staff
const mockTasks = [
  { id: 1, title: "Review Client Proposal", priority: "high", dueDate: "2023-12-01", client: "Tech Solutions Inc", status: "in-progress" },
  { id: 2, title: "Content Update for Website", priority: "medium", dueDate: "2023-12-05", client: "Global Marketing Group", status: "not-started" },
  { id: 3, title: "Monthly Report Preparation", priority: "high", dueDate: "2023-11-30", client: "Pinnacle Design Co", status: "in-progress" }
];

const StaffDashboardContent: React.FC<StaffDashboardContentProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  const roleTabs = ["Overview", "Projects", "Tasks", "Clients", "Content"];
  
  // Define custom sub-tabs for staff
  const customSubTabs: Record<string, string[]> = {
    "Projects": ["Active Projects", "Completed", "Planning"],
    "Tasks": ["My Tasks", "Team Tasks", "Completed", "Overdue"],
    "Clients": ["All Clients", "My Clients", "Leads"],
    "Content": ["Articles", "Social Media", "Website", "Email"]
  };
  
  // Use the dashboard navigation hook
  const { 
    activeTab, 
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    currentSubTabs,
    handlePrevTab,
    handleNextTab,
    handlePrevSubTab,
    handleNextSubTab
  } = useDashboardNavigation(roleTabs, "Overview", customSubTabs);
  
  // Close the user menu when clicking outside
  useClickOutside(userMenuRef, () => {
    setIsUserMenuOpen(false);
  });
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      case "medium":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 bg-opacity-40 text-yellow-300';
      case "low":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      case "in-progress":
        return theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 bg-opacity-40 text-blue-300';
      case "not-started":
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
      case "overdue":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-t-lg p-2 sm:p-3 px-3 sm:px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-blue-500" />
            <h1 className="text-lg sm:text-xl font-medium">
              Staff Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className={`p-1.5 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'} rounded-md md:hidden`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {roleTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab 
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-[#182032] text-white'}`
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#182032]'}`
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* User menu - Desktop */}
            <div className="hidden md:flex items-center">
              <button 
                className={`ml-2 p-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                onClick={toggleTheme}
              >
                {theme === 'light' ? 
                  <Moon className="h-4 w-4 text-gray-700" /> : 
                  <Sun className="h-4 w-4 text-gray-300" />
                }
              </button>
              
              <div className="relative ml-2" ref={userMenuRef}>
                <div 
                  className={`flex items-center px-2 py-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md cursor-pointer`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-4 w-4 mr-1.5 text-blue-400" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user?.firstName || user?.first_name || 'Staff'}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg ${
                      theme === 'light' ? 'bg-white ring-1 ring-black ring-opacity-5' : 'bg-[#1e2a45] ring-1 ring-gray-700'
                    } overflow-hidden z-50`}
                  >
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className={`block px-4 py-2 text-sm ${
                          theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'
                        }`}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className={`block px-4 py-2 text-sm ${
                          theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'
                        }`}
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'
                        }`}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`${theme === 'light' ? 'bg-white border-x border-gray-200' : 'bg-[#162238] border-x border-[#2a3448]'} md:hidden px-3 py-2`}>
          <div className="flex justify-between items-center">
            <button 
              onClick={handlePrevTab}
              className={`p-1 ${activeTab === roleTabs[0] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={activeTab === roleTabs[0]}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">{activeTab}</div>
            <button 
              onClick={handleNextTab}
              className={`p-1 ${activeTab === roleTabs[roleTabs.length - 1] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={activeTab === roleTabs[roleTabs.length - 1]}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Sub Navigation - Show when there are sub-tabs */}
        {currentSubTabs.length > 0 && (
          <div className={`${theme === 'light' ? 'bg-white border-x border-gray-200' : 'bg-[#162238] border-x border-[#2a3448]'} px-3 py-2`}>
            {/* Mobile Sub Navigation */}
            <div className="md:hidden flex justify-between items-center">
              <button 
                onClick={handlePrevSubTab}
                className={`p-1 ${activeSubTab === currentSubTabs[0] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={activeSubTab === currentSubTabs[0]}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium">{activeSubTab}</div>
              <button 
                onClick={handleNextSubTab}
                className={`p-1 ${activeSubTab === currentSubTabs[currentSubTabs.length - 1] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={activeSubTab === currentSubTabs[currentSubTabs.length - 1]}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {/* Desktop Sub Navigation */}
            <div className="hidden md:flex space-x-2 overflow-x-auto">
              {currentSubTabs.map(subTab => (
                <button
                  key={subTab}
                  className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeSubTab === subTab 
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-[#182032] text-white'}`
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#182032]'}`
                  }`}
                  onClick={() => setActiveSubTab(subTab)}
                >
                  {subTab}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className={`${theme === 'light' ? 'bg-white border-x border-b border-gray-200' : 'bg-[#162238] border-x border-b border-[#2a3448]'} rounded-b-lg p-4 sm:p-6`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3">Loading data...</span>
            </div>
          ) : error ? (
            <ErrorDisplay 
              error={error} 
              onDismiss={clearError} 
              onRetry={() => {
                clearError();
                // Re-fetch data based on active tab
              }}
            />
          ) : (
            <>
              {/* Overview Tab Content */}
              {activeTab === "Overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                      title="Assigned Tasks" 
                      value="12"
                      icon={<ClipboardCheck className="h-5 w-5 text-blue-500" />}
                      trend={{
                        value: "+3",
                        label: "from last week",
                        direction: "up"
                      }}
                    />
                    
                    <MetricCard 
                      title="Active Projects" 
                      value="5"
                      icon={<Briefcase className="h-5 w-5 text-green-500" />}
                      trend={{
                        value: "+1",
                        label: "from last month",
                        direction: "up"
                      }}
                    />
                    
                    <MetricCard 
                      title="Client Messages" 
                      value="8"
                      icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
                      trend={{
                        value: "-2",
                        label: "from yesterday",
                        direction: "down"
                      }}
                    />
                    
                    <MetricCard 
                      title="Upcoming Deadlines" 
                      value="3"
                      icon={<CalendarClock className="h-5 w-5 text-amber-500" />}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Upcoming Tasks
                    </h2>
                    <div className={`rounded-lg overflow-hidden ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1e2a45] border border-[#2a3448]'}`}>
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}>
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Task
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                              Priority
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Client
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                          {tasks.map((task) => (
                            <tr key={task.id}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                      {task.title}
                                    </div>
                                    <div className="text-sm text-gray-500 sm:hidden">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                {task.client}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                {formatDate(task.dueDate)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-3 bg-opacity-30 flex justify-center">
                        <Link 
                          to="#" 
                          onClick={() => setActiveTab("Tasks")}
                          className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} flex items-center`}
                        >
                          View all tasks
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Projects Tab Content */}
              {activeTab === "Projects" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Project Management
                  </h2>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Currently viewing: {activeSubTab || "Active Projects"}
                  </div>
                  {/* Project listing would go here */}
                </div>
              )}
              
              {/* Tasks Tab Content */}
              {activeTab === "Tasks" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Task Management
                  </h2>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Currently viewing: {activeSubTab || "My Tasks"}
                  </div>
                  {/* Task listing would go here */}
                </div>
              )}
              
              {/* Clients Tab Content */}
              {activeTab === "Clients" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Client Management
                  </h2>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Currently viewing: {activeSubTab || "All Clients"}
                  </div>
                  {/* Client listing would go here */}
                </div>
              )}
              
              {/* Content Tab Content */}
              {activeTab === "Content" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Content Management
                  </h2>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Currently viewing: {activeSubTab || "Articles"}
                  </div>
                  {/* Content management would go here */}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Mobile User Menu - Shown when mobile menu is open */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-2 rounded-lg overflow-hidden ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'}`}>
            <div className="divide-y divide-gray-700">
              <div className="px-4 py-3">
                <div className="text-sm font-medium">{user?.firstName || 'Staff'} {user?.lastName || ''}</div>
                <div className="text-xs text-gray-500">{user?.email || 'staff@example.com'}</div>
              </div>
              <div className="py-2">
                <Link 
                  to="/profile" 
                  className={`block px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'}`}
                >
                  Your Profile
                </Link>
                <Link 
                  to="/settings" 
                  className={`block px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'}`}
                >
                  Settings
                </Link>
                <button 
                  onClick={toggleTheme}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'}`}
                >
                  {theme === 'light' ? 
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      <span>Dark Mode</span>
                    </> : 
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      <span>Light Mode</span>
                    </>
                  }
                </button>
                <button 
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-[#182032]'}`}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboardContent;
