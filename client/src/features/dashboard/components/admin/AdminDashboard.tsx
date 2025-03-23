import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Search, 
  User, 
  Download, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity, 
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

const recentSales = [
  { id: 1, firstName: "Olivia", lastName: "Martin", email: "olivia.martin@email.com", amount: 1999 },
  { id: 2, firstName: "Jackson", lastName: "Lee", email: "jackson.lee@email.com", amount: 39 },
  { id: 3, firstName: "Isabella", lastName: "Nguyen", email: "isabella.nguyen@email.com", amount: 299 },
  { id: 4, firstName: "William", lastName: "Kim", email: "will@email.com", amount: 99 },
  { id: 5, firstName: "Sofia", lastName: "Davis", email: "sofia.davis@email.com", amount: 39 }
];

interface AdminDashboardProps {
  user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentMobileTabIndex, setCurrentMobileTabIndex] = useState(0);
  const [currentMobileSubTabIndex, setCurrentMobileSubTabIndex] = useState(0);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Admin-specific tabs
  const roleTabs = ["Overview", "Users", "Services", "Invoices", "Content", "Analytics"];
  
  // Sub-tabs for different main tabs
  const overviewSubTabs = ["Dashboard", "Metrics", "Reports", "Notifications"];
  const usersSubTabs = ["All Users", "Staff", "Clients", "Pending"];
  const servicesSubTabs = ["Active Services", "Packages", "Custom", "Add-ons"];
  const invoicesSubTabs = ["Recent", "Paid", "Pending", "Overdue"];
  const contentSubTabs = ["Website", "Social", "Email", "Documents"];
  const analyticsSubTabs = ["Traffic", "Conversion", "Engagement", "Revenue"];
  
  // Get current sub-tabs based on active main tab
  const getCurrentSubTabs = () => {
    switch(activeTab) {
      case "Overview": return overviewSubTabs;
      case "Users": return usersSubTabs;
      case "Services": return servicesSubTabs;
      case "Invoices": return invoicesSubTabs;
      case "Content": return contentSubTabs;
      case "Analytics": return analyticsSubTabs;
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
      case "Overview": 
        defaultSubTab = overviewSubTabs[0];
        break;
      case "Users": 
        defaultSubTab = usersSubTabs[0];
        break;
      case "Services": 
        defaultSubTab = servicesSubTabs[0];
        break;
      case "Invoices": 
        defaultSubTab = invoicesSubTabs[0];
        break;
      case "Content": 
        defaultSubTab = contentSubTabs[0];
        break;
      case "Analytics": 
        defaultSubTab = analyticsSubTabs[0];
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Dashboard metrics
  const metrics = {
    totalRevenue: { value: 45231.89, change: '+20.1%' },
    subscriptions: { value: 2350, change: '+180.1%' },
    sales: { value: 12234, change: '+19%' },
    activeNow: { value: 573, change: '+201' }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-t-lg p-3 px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-teal-400" />
            <h1 className="text-xl font-medium">Admin Dashboard</h1>
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

            {/* Client selector dropdown - for admin role - Removed from main navigation */}
            {/* 
            {(activeTab === "Users" || activeTab === "Invoices" || activeTab === "Content") && (
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
                      Select Client
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
            */}
            
            {/* User menu with admin options */}
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
                    {user?.first_name || 'Admin'}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 py-2 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-20`}
                  >
                    <div className={`px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Signed in as <span className="font-medium">{user?.email || 'admin@example.com'}</span>
                    </div>
                    <div className="border-t my-1"></div>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/admin/settings')}
                    >
                      Admin Settings
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/admin/user-management')}
                    >
                      User Management
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
                    {user?.first_name || 'Admin'}
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
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'}`}
                onClick={() => {
                  navigate('/dashboard/admin/settings');
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">Admin Settings</span>
              </button>
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'}`}
                onClick={() => {
                  navigate('/dashboard/admin/user-management');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">User Management</span>
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
          
          {/* Main Content */}
          <div>
            {activeTab === "Overview" && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`text-xl font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {activeSubTab === "Dashboard" ? "Admin Dashboard" : 
                     activeSubTab === "Metrics" ? "Key Performance Metrics" : 
                     activeSubTab === "Reports" ? "System Reports" : 
                     "System Notifications"}
                  </h3>
                  <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Last updated: Today at 10:30 AM</span>
                </div>
                
                {/* Dashboard Cards - Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Revenue */}
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Total Revenue
                      </h3>
                      <DollarSign className="h-4 w-4 text-teal-400" />
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {formatCurrency(metrics.totalRevenue.value)}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${
                        metrics.totalRevenue.change.startsWith('+') 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {metrics.totalRevenue.change} from last month
                      </p>
                    </div>
                  </div>
                  
                  {/* Subscriptions */}
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Subscriptions
                      </h3>
                      <Users className="h-4 w-4 text-teal-400" />
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {metrics.subscriptions.value.toLocaleString()}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${
                        metrics.subscriptions.change.startsWith('+') 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {metrics.subscriptions.change} from last month
                      </p>
                    </div>
                  </div>
                  
                  {/* Sales */}
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Sales
                      </h3>
                      <ShoppingCart className="h-4 w-4 text-teal-400" />
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {metrics.sales.value.toLocaleString()}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${
                        metrics.sales.change.startsWith('+') 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {metrics.sales.change} from last month
                      </p>
                    </div>
                  </div>
                  
                  {/* Active Now */}
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Active Now
                      </h3>
                      <Activity className="h-4 w-4 text-teal-400" />
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {metrics.activeNow.value.toLocaleString()}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${
                        metrics.activeNow.change.startsWith('+') 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {metrics.activeNow.change} from last hour
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Sales Section */}
                <div className="mb-6">
                  <h3 className={`text-base font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Recent Sales
                  </h3>
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-lg overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`${theme === 'light' ? 'bg-gray-100' : 'bg-[#12192e]'}`}>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Customer
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Email
                            </th>
                            <th className={`px-4 py-3 text-right text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`${theme === 'light' ? 'divide-y divide-gray-200' : 'divide-y divide-[#2a3448]'}`}>
                          {recentSales.map(sale => (
                            <tr key={sale.id} className="hover:bg-opacity-50 hover:bg-gray-700">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ${theme === 'light' ? 'text-indigo-500' : 'text-indigo-400'}`}>
                                    {sale.firstName.charAt(0)}{sale.lastName.charAt(0)}
                                  </div>
                                  <div className="ml-3">
                                    <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm font-medium`}>
                                      {sale.firstName} {sale.lastName}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <a 
                                  href={`mailto:${sale.email}`} 
                                  className={`${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'}`}
                                >
                                  {sale.email}
                                </a>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                                  {formatCurrency(sale.amount)}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-[#12192e]'} px-4 py-3 flex items-center justify-between`}>
                      <div>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Showing 5 of 24 sales
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className={`text-xs px-3 py-1.5 ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#182032] border border-[#2a3448] text-gray-300 hover:bg-[#1e2a45]'} rounded`}
                        >
                          Previous
                        </button>
                        <button 
                          className={`text-xs px-3 py-1.5 ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#182032] border border-[#2a3448] text-gray-300 hover:bg-[#1e2a45]'} rounded`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "Users" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {activeSubTab === "All Users" ? "All Users Management" : 
                     activeSubTab === "Staff" ? "Staff Management" : 
                     activeSubTab === "Clients" ? "Client Management" : 
                     "Pending User Requests"}
                  </h3>
                  
                  {/* Additional client selector for the content area */}
                  {(activeSubTab === "Clients" || activeSubTab === "Pending") && (
                    <div className="relative inline-block">
                      <button
                        className={`flex items-center px-3 py-1.5 text-sm ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                        onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                      >
                        <span className="mr-1">Client:</span>
                        <span className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {/* User management content filtered by sub-tab */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab.toLowerCase()} management content will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Services" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {activeSubTab === "Active Services" ? "Active Services Management" : 
                   activeSubTab === "Packages" ? "Service Packages" : 
                   activeSubTab === "Custom" ? "Custom Services" : 
                   "Service Add-ons"}
                </h3>
                {/* Service management content filtered by sub-tab */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab.toLowerCase()} content will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Invoices" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {activeSubTab === "Recent" ? "Recent Invoices" : 
                     activeSubTab === "Paid" ? "Paid Invoices" : 
                     activeSubTab === "Pending" ? "Pending Invoices" : 
                     "Overdue Invoices"}
                  </h3>
                  
                  {/* Additional client selector for the invoice area */}
                  <div className="relative inline-block">
                    <button
                      className={`flex items-center px-3 py-1.5 text-sm ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                      onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                    >
                      <span className="mr-1">Client:</span>
                      <span className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
                {/* Invoices content filtered by sub-tab */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab.toLowerCase()} invoices will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Content" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {activeSubTab === "Website" ? "Website Content Management" : 
                     activeSubTab === "Social" ? "Social Media Content" : 
                     activeSubTab === "Email" ? "Email Content" : 
                     "Document Management"}
                  </h3>
                  
                  {/* Additional client selector for the content area */}
                  <div className="relative inline-block">
                    <button
                      className={`flex items-center px-3 py-1.5 text-sm ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md`}
                      onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                    >
                      <span className="mr-1">Client:</span>
                      <span className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
                {/* Content management filtered by sub-tab */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab.toLowerCase()} content management will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Analytics" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {activeSubTab === "Traffic" ? "Traffic Analytics" : 
                   activeSubTab === "Conversion" ? "Conversion Metrics" : 
                   activeSubTab === "Engagement" ? "User Engagement" : 
                   "Revenue Analytics"}
                </h3>
                {/* Analytics content filtered by sub-tab */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab.toLowerCase()} analytics will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
