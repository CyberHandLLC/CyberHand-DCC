import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Search, 
  User, 
  Download, 
  FileText, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Sun, 
  Moon,
  Menu, 
  X, 
  ChevronDown,
  MoreVertical,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

// Mock data for the dashboard
const clients = [
  { id: 1, firstName: "Alicia", lastName: "Koch", email: "alicia@example.com", role: "Admin" },
  { id: 2, firstName: "John", lastName: "Smith", email: "john@example.com", role: "Client" },
  { id: 3, firstName: "Sarah", lastName: "Lee", email: "sarah@example.com", role: "Client" }
];

// Mock tasks for staff
const tasks = [
  { 
    id: 1, 
    title: "Update blog content for Alicia Koch", 
    client: "Alicia Koch", 
    dueDate: "2025-04-15", 
    status: "in_progress",
    priority: "high"
  },
  { 
    id: 2, 
    title: "Create social media posts for John Smith", 
    client: "John Smith", 
    dueDate: "2025-04-10", 
    status: "todo",
    priority: "medium"
  },
  { 
    id: 3, 
    title: "SEO optimization for Sarah Lee's website", 
    client: "Sarah Lee", 
    dueDate: "2025-04-20", 
    status: "completed",
    priority: "low"
  },
  { 
    id: 4, 
    title: "Prepare monthly report for Alicia Koch", 
    client: "Alicia Koch", 
    dueDate: "2025-04-30", 
    status: "todo",
    priority: "high"
  }
];

interface StaffDashboardProps {
  user: any;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Tasks");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentMobileTabIndex, setCurrentMobileTabIndex] = useState(0);
  const [currentMobileSubTabIndex, setCurrentMobileSubTabIndex] = useState(0);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Staff-specific tabs
  const roleTabs = ["Tasks", "Clients", "Calendar", "Messages", "Knowledge"];
  
  // Sub-tabs for different main tabs
  const overviewSubTabs = ["Dashboard", "Recent", "Upcoming", "Stats"];
  const tasksSubTabs = ["All Tasks", "Assigned", "Completed", "Pending"];
  const calendarSubTabs = ["Day", "Week", "Month", "Agenda"];
  const messagesSubTabs = ["Inbox", "Sent", "Drafts", "Archive"];
  const reportsSubTabs = ["Weekly", "Monthly", "Client", "Team"];
  
  // Get current sub-tabs based on active main tab
  const getCurrentSubTabs = () => {
    switch(activeTab) {
      case "Tasks": return tasksSubTabs;
      case "Calendar": return calendarSubTabs;
      case "Messages": return messagesSubTabs;
      case "Reports": return reportsSubTabs;
      default: return [];
    }
  };
  
  const currentSubTabs = getCurrentSubTabs();
  const maxMobileSubTabIndex = currentSubTabs.length - 1;
  
  // Calculate mobile tab index limits
  const maxMobileTabIndex = roleTabs.length - 1;

  // Navigate to previous/next tab on mobile
  const handlePrevTab = () => {
    setCurrentMobileTabIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : 0;
      setActiveTab(roleTabs[newIndex]);
      // Reset sub-tab when changing main tab
      resetSubTabsForNewMainTab(roleTabs[newIndex]);
      return newIndex;
    });
  };

  const handleNextTab = () => {
    setCurrentMobileTabIndex(prev => {
      const newIndex = prev < maxMobileTabIndex ? prev + 1 : maxMobileTabIndex;
      setActiveTab(roleTabs[newIndex]);
      // Reset sub-tab when changing main tab
      resetSubTabsForNewMainTab(roleTabs[newIndex]);
      return newIndex;
    });
  };
  
  // Navigate to previous/next sub-tab on mobile
  const handlePrevSubTab = () => {
    if (currentSubTabs.length === 0) return;
    
    setCurrentMobileSubTabIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : 0;
      setActiveSubTab(currentSubTabs[newIndex]);
      return newIndex;
    });
  };

  const handleNextSubTab = () => {
    if (currentSubTabs.length === 0) return;
    
    setCurrentMobileSubTabIndex(prev => {
      const newIndex = prev < maxMobileSubTabIndex ? prev + 1 : maxMobileSubTabIndex;
      setActiveSubTab(currentSubTabs[newIndex]);
      return newIndex;
    });
  };
  
  // Reset sub-tabs when changing main tab
  const resetSubTabsForNewMainTab = (newMainTab: string) => {
    let defaultSubTab;
    let defaultIndex = 0;
    
    switch(newMainTab) {
      case "Tasks": 
        defaultSubTab = tasksSubTabs[0];
        break;
      case "Calendar": 
        defaultSubTab = calendarSubTabs[0];
        break;
      case "Messages": 
        defaultSubTab = messagesSubTabs[0];
        break;
      case "Reports": 
        defaultSubTab = reportsSubTabs[0];
        break;
      default:
        defaultSubTab = "";
    }
    
    setActiveSubTab(defaultSubTab);
    setCurrentMobileSubTabIndex(defaultIndex);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter tasks based on the active subtab
  const getFilteredTasks = () => {
    if (activeSubTab === "All Tasks") {
      return tasks;
    }
    
    // Map UI-friendly subtab names to status values
    const statusMap: Record<string, string> = {
      "Assigned": "todo",
      "Completed": "completed",
      "Pending": "pending"
    };
    
    return tasks.filter(task => task.status === statusMap[activeSubTab]);
  };

  const filteredTasks = getFilteredTasks();

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "todo":
        return theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 bg-opacity-40 text-blue-300';
      case "in_progress":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 bg-opacity-40 text-yellow-300';
      case "completed":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };

  // Get human-readable status
  const getStatusText = (status: string) => {
    switch(status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      case "medium":
        return theme === 'light' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 bg-opacity-40 text-orange-300';
      case "low":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-t-lg p-3 px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-teal-400" />
            <h1 className="text-xl font-medium">Staff Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button - Now only shows/hides user settings */}
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
            
            {/* Client selector - Only show when in relevant tabs */}
            {(activeTab === "Tasks" || activeTab === "Content" || activeTab === "Client Management" || activeTab === "Support Tickets") && (
              <div className="relative hidden md:block" ref={clientDropdownRef}>
                <div 
                  className={`flex items-center px-2 py-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md cursor-pointer`}
                  onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                >
                  <Users className="h-4 w-4 mr-1.5 text-teal-400" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {selectedClient.firstName} {selectedClient.lastName}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isClientDropdownOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-56 py-2 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-20`}
                  >
                    <div className={`px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Switch client
                    </div>
                    {clients.map(client => (
                      <button 
                        key={client.id}
                        className={`w-full text-left px-4 py-2 text-sm ${client.id === selectedClient.id ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''} ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                        onClick={() => {
                          setSelectedClient(client);
                          setIsClientDropdownOpen(false);
                        }}
                      >
                        {client.firstName} {client.lastName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* User menu - Desktop */}
            <div className="hidden md:block">
              <button 
                className={`ml-2 p-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                onClick={toggleTheme}
              >
                {theme === 'light' ? 
                  <Moon className="h-4 w-4 text-gray-700" /> : 
                  <Sun className="h-4 w-4 text-gray-300" />
                }
              </button>
              
              <div className="relative ml-2 inline-block" ref={userMenuRef}>
                <div 
                  className={`flex items-center px-2 py-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md cursor-pointer`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-4 w-4 mr-1.5 text-teal-400" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user?.first_name || 'Staff'}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 py-2 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-20`}
                  >
                    <div className={`px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Signed in as <span className="font-medium">{user?.email || 'staff@example.com'}</span>
                    </div>
                    <div className="border-t my-1"></div>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/staff/profile')}
                    >
                      My Profile
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/staff/calendar')}
                    >
                      My Calendar
                    </button>
                    <div className="border-t my-1"></div>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-red-600 hover:bg-gray-100' : 'text-red-400 hover:bg-[#1e2a45]'}`}
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation with Arrows - Always visible on mobile */}
        <div className={`${theme === 'light' ? 'bg-white border-t border-x border-gray-200' : 'bg-[#162238] border-t border-x border-[#2a3448]'} p-3 md:hidden flex items-center justify-between`}>
          <button 
            onClick={handlePrevTab}
            disabled={currentMobileTabIndex === 0}
            className={`p-1.5 rounded-md ${currentMobileTabIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-medium px-3 py-1.5 rounded-md text-center min-w-[100px] bg-opacity-90 bg-[#162238]">
            {roleTabs[currentMobileTabIndex]}
          </span>
          
          <button 
            onClick={handleNextTab}
            disabled={currentMobileTabIndex === maxMobileTabIndex}
            className={`p-1.5 rounded-md ${currentMobileTabIndex === maxMobileTabIndex ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Mobile User Menu */}
        {isMobileMenuOpen && (
          <div className={`${theme === 'light' ? 'bg-white border-t border-x border-gray-200' : 'bg-[#162238] border-t border-x border-[#2a3448]'} p-3 md:hidden`}>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-teal-400" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user?.first_name || 'Staff'}
                  </span>
                </div>
                <button 
                  className={`p-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? 
                    <Moon className="h-4 w-4 text-gray-700" /> : 
                    <Sun className="h-4 w-4 text-gray-300" />
                  }
                </button>
              </div>
              
              {/* Client selector for mobile - Show only when in client-related tabs */}
              {(activeTab === "Tasks" || activeTab === "Content" || activeTab === "Client Management" || activeTab === "Support Tickets") && (
                <div className="mb-1 pb-2 border-b">
                  <div className="text-sm font-medium mb-1">Select Client</div>
                  <div className="max-h-32 overflow-y-auto">
                    {clients.map(client => (
                      <button 
                        key={client.id}
                        className={`w-full text-left px-2 py-1.5 text-sm mb-1 rounded-md ${client.id === selectedClient.id ? (theme === 'light' ? 'bg-gray-100' : 'bg-[#1e2a45]') : ''} ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                        onClick={() => {
                          setSelectedClient(client);
                        }}
                      >
                        {client.firstName} {client.lastName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'}`}
                onClick={() => {
                  navigate('/dashboard/staff/profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">My Profile</span>
              </button>
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'}`}
                onClick={() => {
                  navigate('/dashboard/staff/calendar');
                  setIsMobileMenuOpen(false);
                }}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                <span className="text-sm">My Calendar</span>
              </button>
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-500/10 hover:bg-red-500/20'} ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}
                onClick={handleLogout}
              >
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Dashboard Content */}
        <div className={`${theme === 'light' ? 'bg-white border-b border-x border-gray-200' : 'bg-[#162238] border-b border-x border-[#2a3448]'} rounded-b-lg p-4 sm:p-6`}>
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm mb-5">
            <Link to="/dashboard" className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} hover:underline`}>
              Dashboard
            </Link>
            {activeTab !== "Overview" && (
              <>
                <span className="mx-2">/</span>
                <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{activeTab}</span>
              </>
            )}
          </div>
          
          {/* Client Selector - Only show for Tasks and Reports tabs */}
          {(activeTab === "Tasks" || activeTab === "Content" || activeTab === "Client Management" || activeTab === "Support Tickets") && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Select Client</h3>
                <div className="relative" ref={clientDropdownRef}>
                  <button 
                    className={`flex items-center px-3 py-1.5 text-sm ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                    onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                  >
                    {selectedClient.firstName} {selectedClient.lastName}
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </button>
                  
                  {isClientDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 py-1 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-10`}>
                      {clients.map(client => (
                        <button
                          key={client.id}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedClient.id === client.id
                              ? `${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-[#1e2a45] text-white'}`
                              : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`
                          }`}
                          onClick={() => {
                            setSelectedClient(client);
                            setIsClientDropdownOpen(false);
                          }}
                        >
                          {client.firstName} {client.lastName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Sub-tabs for mobile (when applicable) */}
          {currentSubTabs.length > 0 && (
            <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} p-2 mb-4 md:hidden rounded-md flex items-center justify-between`}>
              <button 
                onClick={handlePrevSubTab}
                disabled={currentMobileSubTabIndex === 0}
                className={`p-1.5 rounded-md ${currentMobileSubTabIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}`}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              
              <span className="font-medium text-xs px-2 py-1 rounded-md text-center min-w-[80px] bg-opacity-90 bg-[#162238]">
                {currentSubTabs[currentMobileSubTabIndex]}
              </span>
              
              <button 
                onClick={handleNextSubTab}
                disabled={currentMobileSubTabIndex === maxMobileSubTabIndex}
                className={`p-1.5 rounded-md ${currentMobileSubTabIndex === maxMobileSubTabIndex ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}`}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {/* Sub-tabs for desktop (when applicable) */}
          {currentSubTabs.length > 0 && (
            <div className="hidden md:flex space-x-1 mb-4 overflow-x-auto">
              {currentSubTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    activeSubTab === tab 
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-[#182032] text-white'}`
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#182032]'}`
                  }`}
                  onClick={() => {
                    setActiveSubTab(tab);
                    setCurrentMobileSubTabIndex(currentSubTabs.indexOf(tab));
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
          
          {/* Main Dashboard Content */}
          <div>
            {activeTab === "Tasks" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {activeSubTab === "All Tasks" ? "All Tasks" : 
                   activeSubTab === "Assigned" ? "Assigned Tasks" : 
                   activeSubTab === "Completed" ? "Completed Tasks" : 
                   "Pending Tasks"}
                </h3>
                {/* Task content filtered by sub-tab */}
                <div className="space-y-3">
                  {tasks
                    .filter(task => {
                      // Filter tasks based on selected client
                      if (task.client !== selectedClient.firstName + " " + selectedClient.lastName) return false;
                      
                      // Filter tasks based on sub-tab
                      if (activeSubTab === "All Tasks") return true;
                      if (activeSubTab === "Assigned" && task.status === "todo") return true;
                      if (activeSubTab === "Completed" && task.status === "completed") return true;
                      if (activeSubTab === "Pending" && task.status === "todo") return true;
                      return false;
                    })
                    .map(task => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg ${theme === 'light' 
                          ? 'bg-gray-50 border border-gray-200' 
                          : 'bg-[#182032] border border-[#2a3448]'
                        }`}
                      >
                        <div className="flex justify-between mb-1">
                          <h5 className="font-medium">{task.title}</h5>
                          <span 
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : task.status === 'todo' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                          {task.title}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Due: {formatDate(task.dueDate)}
                          </span>
                          <button className={`text-xs px-3 py-1 rounded-md ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-[#1e2a45] hover:bg-[#253552] text-gray-200'}`}>
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {tasks.filter(task => 
                      task.client === selectedClient.firstName + " " + selectedClient.lastName && (
                        activeSubTab === "All Tasks" ? true :
                        activeSubTab === "Assigned" ? task.status === "todo" :
                        activeSubTab === "Completed" ? task.status === "completed" :
                        activeSubTab === "Pending" ? task.status === "todo" : false
                      )
                    ).length === 0 && (
                      <p className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        No {activeSubTab.toLowerCase()} found for this client.
                      </p>
                    )}
                </div>
              </div>
            )}
            
            {activeTab === "Projects" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Project Management
                </h3>
                {/* Placeholder for project management section */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Project management content will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Content" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Content Management for {selectedClient.firstName} {selectedClient.lastName}
                </h3>
                {/* Placeholder for content management section */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Content management for {selectedClient.firstName} {selectedClient.lastName} will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Leads" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Lead Management
                </h3>
                {/* Placeholder for lead management section */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Lead management content will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Communication" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Communication with {selectedClient.firstName} {selectedClient.lastName}
                </h3>
                {/* Placeholder for communication section */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Communication tools for {selectedClient.firstName} {selectedClient.lastName} will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
