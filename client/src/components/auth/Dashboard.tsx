import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
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
  LayoutDashboard
} from 'lucide-react';

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

// Dashboard component
const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
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

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Debug user object - check in console
  console.log('Current user in Dashboard:', user);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Dashboard metrics (role-based)
  const getDashboardMetrics = () => {
    // Normalize role to handle case sensitivity
    const userRole = user?.role ? user.role.toLowerCase() : 'unknown';
    
    if (userRole === 'admin' || userRole === 'staff') {
      return {
        totalRevenue: { value: 45231.89, change: '+20.1%' },
        subscriptions: { value: 2350, change: '+180.1%' },
        sales: { value: 12234, change: '+19%' },
        activeNow: { value: 573, change: '+201' }
      };
    } else {
      return {
        totalRevenue: { value: 1250.00, change: '+5.1%' },
        subscriptions: { value: 3, change: '+1' },
        sales: { value: 24, change: '+12%' },
        activeNow: { value: 2, change: '+1' }
      };
    }
  };

  // Get role-specific dashboard tabs
  const getRoleTabs = () => {
    // Ensure we have a role and normalize it to handle case sensitivity
    const userRole = user?.role ? user.role.toLowerCase() : 'unknown';
    console.log('User role detected:', userRole);
    
    switch(userRole) {
      case 'admin':
        return ["Overview", "Customers", "Products", "Settings"];
      case 'staff':
        return ["Tasks", "Projects", "Content", "Leads", "Communication"];
      case 'client':
        return ["Overview", "Services", "Invoices", "Reports", "Support"];
      case 'observer':
        return ["Services", "Profile"];
      default:
        console.log('Falling back to default tabs, role not recognized:', userRole);
        // If no role matches, provide the admin tabs as a fallback
        return ["Overview", "Customers", "Products", "Settings"];
    }
  };

  // Get role-specific sub tabs
  const getRoleSubTabs = () => {
    // Normalize role to handle case sensitivity
    const userRole = user?.role ? user.role.toLowerCase() : 'unknown';
    
    switch(userRole) {
      case 'admin':
        return ["Overview", "Analytics", "Reports", "Notifications"];
      case 'staff':
        return ["Assigned", "In Progress", "Completed", "All"];
      case 'client':
        return ["Active", "Pending", "History"];
      case 'observer':
        return ["Available", "Purchased"];
      default:
        // If no role matches, provide the admin sub-tabs as a fallback
        return ["Overview", "Analytics", "Reports", "Notifications"];
    }
  };

  const metrics = getDashboardMetrics();
  const roleTabs = getRoleTabs();
  const roleSubTabs = getRoleSubTabs();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238]'} rounded-t-lg p-2 sm:p-3 px-3 sm:px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-teal-400" />
            <h1 className="text-lg sm:text-xl font-medium text-white">
              CyberHand Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className={`p-1.5 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'} rounded-md md:hidden`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {roleTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-sm ${
                    activeTab === tab
                      ? theme === 'light' ? 'text-gray-900' : 'text-white'
                      : theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Search Bar - Hide on extra small screens */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className={`${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500' : 'bg-[#1e293b] border-[#1e293b] text-gray-100 placeholder-gray-400'} focus:outline-none block w-36 md:w-48 pl-10 pr-3 py-1.5 border rounded-md text-sm`}
                placeholder="Search..."
              />
            </div>
            
            <button className={`p-1.5 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'} rounded-md`}>
              <User className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#182032] border-[#30384a]'} border-l border-r px-4 py-2`}>
            <div className="space-y-2">
              {roleTabs.map(tab => (
                <button
                  key={tab}
                  className={`block w-full text-left px-2 py-2 rounded-md text-sm ${
                    activeTab === tab
                      ? theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-[#1e293b] text-white'
                      : theme === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab}
                </button>
              ))}
              
              {/* Mobile Search */}
              <div className="relative mt-3 sm:hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`${theme === 'light' ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500' : 'bg-[#1e293b] border-[#1e293b] text-gray-100 placeholder-gray-400'} focus:outline-none block w-full pl-10 pr-3 py-2 border rounded-md text-sm`}
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Client Selector and Tabs - Role-specific left section */}
        <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#121a2d] border-[#30384a]'} p-2 sm:p-3 px-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b`}>
          {/* Left section - Admin gets client selector, others get profile */}
          <div className="relative mb-3 sm:mb-0" ref={clientDropdownRef}>
            {user?.role?.toLowerCase() === 'admin' ? (
              <button 
                className="flex items-center space-x-2 px-2 py-1 rounded-md"
                onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              >
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">{selectedClient.firstName.charAt(0)}</span>
                </div>
                <span className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} text-sm`}>{selectedClient.firstName} {selectedClient.lastName}</span>
                <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">{user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                </div>
                <span className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} text-sm`}>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}</span>
              </div>
            )}
            
            {/* Client Dropdown menu - Admin only */}
            {isClientDropdownOpen && user?.role?.toLowerCase() === 'admin' && (
              <div className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg ${theme === 'light' ? 'bg-white ring-gray-200' : 'bg-[#182032] ring-[#30384a]'} ring-1 z-50`}>
                <div className="py-1">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        theme === 'light' 
                          ? 'text-gray-900 hover:bg-gray-100' 
                          : 'text-gray-200 hover:bg-[#1e293b]'
                      }`}
                      onClick={() => {
                        setSelectedClient(client);
                        setIsClientDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mr-2">
                          <span className="text-white text-xs">{client.firstName.charAt(0)}</span>
                        </div>
                        <span>{client.firstName} {client.lastName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sub Tabs - Desktop - Role-specific tabs */}
          <div className="hidden sm:flex space-x-4">
            {roleSubTabs.map(tab => (
              <button
                key={tab}
                className={`px-2 py-2 text-sm font-medium ${
                  activeSubTab === tab
                    ? theme === 'light' ? 'text-gray-900' : 'text-white'
                    : theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Mobile Sub Tabs Toggle */}
          <div className="sm:hidden">
            <button 
              className={`flex items-center justify-between w-full px-2 py-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'} rounded-md`}
              onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
            >
              <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm`}>{activeSubTab}</span>
              <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
            
            {isMobileSubMenuOpen && (
              <div className={`mt-1 rounded-md shadow-lg ${theme === 'light' ? 'bg-white ring-gray-200' : 'bg-[#182032] ring-[#30384a]'} ring-1 z-50`}>
                <div className="py-1">
                  {roleSubTabs.map(tab => (
                    <button
                      key={tab}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        activeSubTab === tab
                          ? theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-[#1e293b] text-white'
                          : theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e293b]'
                      }`}
                      onClick={() => {
                        setActiveSubTab(tab);
                        setIsMobileSubMenuOpen(false);
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-[#111827]'} rounded-b-lg p-3 sm:p-4 md:p-6`}>
          {/* Role-specific metric cards */}
          {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'staff') ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Total Revenue */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Revenue</h3>
                  <DollarSign className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatCurrency(metrics.totalRevenue.value)}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.totalRevenue.change} from last month
                </div>
              </div>
              
              {/* Subscriptions */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Subscriptions</h3>
                  <Users className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>+{metrics.subscriptions.value}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.subscriptions.change} from last month
                </div>
              </div>
              
              {/* Sales */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Sales</h3>
                  <ShoppingCart className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>+{metrics.sales.value}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.sales.change} from last month
                </div>
              </div>
              
              {/* Active Now */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Active Now</h3>
                  <Activity className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>+{metrics.activeNow.value}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.activeNow.change} since last hour
                </div>
              </div>
            </div>
          ) : user?.role?.toLowerCase() === 'client' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Client: My Revenue */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>My Revenue</h3>
                  <DollarSign className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatCurrency(metrics.totalRevenue.value)}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.totalRevenue.change} from last month
                </div>
              </div>
              
              {/* Client: Active Services */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Active Services</h3>
                  <Users className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{metrics.subscriptions.value}</div>
                <div className="mt-1 text-xs text-green-500">
                  {metrics.subscriptions.change} new service
                </div>
              </div>
              
              {/* Client: Open Support Tickets */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Support Tickets</h3>
                  <Activity className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{metrics.activeNow.value}</div>
                <div className="mt-1 text-xs text-green-500">
                  All tickets responded to
                </div>
              </div>
            </div>
          ) : user?.role?.toLowerCase() === 'staff' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Staff: Assigned Tasks */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Assigned Tasks</h3>
                  <CalendarDays className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>12</div>
                <div className="mt-1 text-xs text-amber-500">
                  4 due today
                </div>
              </div>
              
              {/* Staff: Client Projects */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Client Projects</h3>
                  <Users className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>8</div>
                <div className="mt-1 text-xs text-green-500">
                  +2 new projects
                </div>
              </div>
              
              {/* Staff: New Leads */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>New Leads</h3>
                  <Users className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>15</div>
                <div className="mt-1 text-xs text-amber-500">
                  5 need response
                </div>
              </div>
              
              {/* Staff: Support Tickets */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Support Tickets</h3>
                  <Activity className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>7</div>
                <div className="mt-1 text-xs text-red-500">
                  3 high priority
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Observer: Available Services */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Available Services</h3>
                  <ShoppingCart className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>12</div>
                <div className="mt-1 text-xs text-blue-500">
                  Browse services
                </div>
              </div>
              
              {/* Observer: Purchased Services */}
              <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h3 className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Purchased Services</h3>
                  <DollarSign className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>0</div>
                <div className="mt-1 text-xs text-green-500">
                  Get started today!
                </div>
              </div>
            </div>
          )}
          
          {/* Charts and recent sales section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Chart */}
            <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
              <h3 className={`text-base sm:text-lg font-medium mb-4 md:mb-8 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Overview</h3>
              <div className="h-48 sm:h-56 md:h-64 flex items-end space-x-1 sm:space-x-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
                  // Generate the heights for the chart bars to match the image
                  const heights = [45, 15, 15, 60, 50, 60, 40, 25, 25, 20, 15, 30];
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full ${theme === 'light' ? 'bg-teal-400' : 'bg-green-500'} rounded-t`} 
                        style={{ height: `${heights[i]}%` }}
                      ></div>
                      <div className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>{month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recent sales */}
            <div className={`rounded-lg border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-[#30384a] bg-[#1a2236]'} p-3 sm:p-4 md:p-6`}>
              <h3 className={`text-base sm:text-lg font-medium mb-2 sm:mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Recent Sales</h3>
              <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-3 sm:mb-4`}>
                You made 265 sales this month.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {recentSales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-[#2a3349]'} flex items-center justify-center`}>
                        <User className={`h-3 w-3 sm:h-4 sm:w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                      </div>
                      <div>
                        <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{sale.firstName} {sale.lastName}</div>
                        <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{sale.email}</div>
                      </div>
                    </div>
                    <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      +{formatCurrency(sale.amount).replace('$', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Role-specific tab content sections */}
        {user?.role?.toLowerCase() === 'staff' && activeTab === 'Leads' && (
          <div className="mt-6">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Lead Management</h2>
            
            {/* Lead Sources Section */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Lead Sources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Website Forms', 'Social Media', 'Content Downloads', 'Email Campaigns', 'Events', 'Referrals', 'Paid Ads', 'Networking'].map((source) => (
                  <div key={source} className={`p-3 rounded-md ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`}>
                    <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{source}</p>
                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {Math.floor(Math.random() * 20) + 1} leads
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lead List Section */}
            <div className={`mb-6 overflow-hidden rounded-lg ${theme === 'light' ? 'border border-gray-200' : 'border border-[#30384a]'}`}>
              <div className={`px-4 py-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-[#1a2236]'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Lead List</h3>
                  <div className="flex space-x-2">
                    <select className={`text-sm px-2 py-1 rounded ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-700' : 'bg-[#111827] border border-[#30384a] text-gray-300'}`}>
                      <option value="all">All Leads</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                    </select>
                    <button className={`text-sm px-3 py-1 rounded ${theme === 'light' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'}`}>
                      Add Lead
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-[#111827]'}`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#1a2236]'}`}>
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                    {[
                      { id: 1, name: "Michael Brown", email: "michael@example.com", status: "New", source: "Website Form" },
                      { id: 2, name: "Jessica Williams", email: "jessica@example.com", status: "Contacted", source: "Email Campaign" },
                      { id: 3, name: "David Johnson", email: "david@example.com", status: "Qualified", source: "Social Media" },
                      { id: 4, name: "Emily Davis", email: "emily@example.com", status: "Converted", source: "Referral" },
                      { id: 5, name: "Robert Miller", email: "robert@example.com", status: "New", source: "Paid Ad" }
                    ].map((lead) => (
                      <tr key={lead.id}>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{lead.name}</td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{lead.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 
                            lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : 
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{lead.source}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className={`px-2 py-1 text-xs rounded ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900 text-blue-300'}`}>Contact</button>
                            <button className={`px-2 py-1 text-xs rounded ${theme === 'light' ? 'bg-green-50 text-green-700' : 'bg-green-900 text-green-300'}`}>Convert</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Client Role - Services Section */}
        {user?.role?.toLowerCase() === 'client' && activeTab === 'Services' && (
          <div className="mt-6">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Your Services</h2>
            
            {/* Active Services */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Active Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, name: "Website Maintenance", status: "Active", nextBilling: "Apr 15, 2025", price: 99 },
                  { id: 2, name: "SEO Services", status: "Active", nextBilling: "Apr 05, 2025", price: 149 },
                  { id: 3, name: "Content Writing", status: "Active", nextBilling: "Apr 22, 2025", price: 199 }
                ].map((service) => (
                  <div key={service.id} className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {service.status}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Next billing: {service.nextBilling}
                    </p>
                    <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      ${service.price}/month
                    </p>
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 text-xs rounded ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300'}`}>Manage</button>
                      <button className={`px-3 py-1 text-xs rounded ${theme === 'light' ? 'bg-purple-50 text-purple-700' : 'bg-purple-900 text-purple-300'}`}>Upgrade</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommended Upsells */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 border-purple-500 ${theme === 'light' ? 'bg-white' : 'bg-[#111827]'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>AI Chatbot Integration</h4>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      Popular
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Boost customer engagement by 30%
                  </p>
                  <p className={`text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    $99/month
                  </p>
                  <ul className={`text-xs mb-4 space-y-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <li>• 24/7 customer support automation</li>
                    <li>• Lead qualification</li>
                    <li>• Smart product recommendations</li>
                    <li>• Analytics dashboard</li>
                  </ul>
                  <button className="w-full px-3 py-2 text-sm font-medium rounded bg-purple-600 text-white hover:bg-purple-700">
                    Add to Your Plan
                  </button>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Enterprise SEO Package</h4>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Upgrade
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Comprehensive SEO strategy for growth
                  </p>
                  <p className={`text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    $199/month
                  </p>
                  <ul className={`text-xs mb-4 space-y-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <li>• Keyword research & optimization</li>
                    <li>• Competitive analysis</li>
                    <li>• Monthly reporting</li>
                    <li>• Content strategy</li>
                  </ul>
                  <button className="w-full px-3 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observer Role - Services Section */}
        {user?.role?.toLowerCase() === 'observer' && activeTab === 'Services' && (
          <div className="mt-6">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Available Services</h2>
            
            {/* Featured Services */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Featured Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 1, 
                    name: "Website Development", 
                    description: "Custom responsive website built with modern technologies",
                    price: 2499,
                    features: ["Mobile Responsive", "SEO Optimized", "Content Management", "Analytics Integration"]
                  },
                  { 
                    id: 2, 
                    name: "Digital Marketing", 
                    description: "Comprehensive marketing strategy to grow your business",
                    price: 999,
                    features: ["Social Media", "Email Campaigns", "PPC Advertising", "Performance Analytics"]
                  },
                  { 
                    id: 3, 
                    name: "AI Integration", 
                    description: "Add intelligent features to your existing digital products",
                    price: 1499,
                    features: ["Chatbots", "Recommendation Systems", "Data Analysis", "Automation"]
                  }
                ].map((service) => (
                  <div key={service.id} className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`}>
                    <h4 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{service.name}</h4>
                    <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {service.description}
                    </p>
                    <p className={`text-lg font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ${service.price}
                    </p>
                    <ul className={`text-sm mb-4 space-y-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {service.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                    <button className="w-full px-3 py-2 text-sm font-medium rounded bg-purple-600 text-white hover:bg-purple-700">
                      Purchase Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Service Categories */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>All Service Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Web Development", count: 8 },
                  { name: "Digital Marketing", count: 12 },
                  { name: "AI Services", count: 6 },
                  { name: "Cloud Hosting", count: 4 },
                  { name: "E-commerce", count: 7 },
                  { name: "Mobile Apps", count: 5 },
                  { name: "Content Creation", count: 9 },
                  { name: "Consulting", count: 3 }
                ].map((category) => (
                  <div key={category.name} className={`p-3 rounded-md ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`}>
                    <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{category.name}</p>
                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {category.count} services
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Monthly Subscription Options */}
            <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1a2236] border border-[#30384a]'}`}>
              <h3 className={`text-lg font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Monthly Subscriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 1, 
                    name: "Starter Plan", 
                    price: 99,
                    features: ["Website Maintenance", "Basic SEO", "Monthly Report", "Email Support"]
                  },
                  { 
                    id: 2, 
                    name: "Growth Plan", 
                    price: 299,
                    featured: true,
                    features: ["Starter Plan +", "Content Updates", "Social Media Management", "Priority Support"]
                  },
                  { 
                    id: 3, 
                    name: "Enterprise Plan", 
                    price: 499,
                    features: ["Growth Plan +", "Custom Development", "Strategic Consulting", "Dedicated Manager"]
                  }
                ].map((plan) => (
                  <div key={plan.id} 
                    className={`p-4 rounded-lg ${
                      plan.featured 
                        ? `border-2 border-purple-500 ${theme === 'light' ? 'bg-white' : 'bg-[#111827]'}`
                        : `${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#111827] border border-[#30384a]'}`
                    }`}
                  >
                    {plan.featured && (
                      <div className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 inline-block mb-2">
                        Most Popular
                      </div>
                    )}
                    <h4 className={`font-medium text-lg mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{plan.name}</h4>
                    <p className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ${plan.price}<span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <ul className={`text-sm mb-4 space-y-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-0.5 text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full px-3 py-2 text-sm font-medium rounded ${
                      plan.featured
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : theme === 'light' 
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}>
                      {plan.featured ? "Get Started" : "Learn More"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
