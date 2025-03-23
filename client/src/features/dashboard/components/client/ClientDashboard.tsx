import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  User, 
  CreditCard, 
  FileText, 
  LifeBuoy, 
  Sun, 
  Moon,
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  ArrowUpRight,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

interface ClientDashboardProps {
  user: any;
}

// Mock services for client
const services = [
  { 
    id: 1, 
    name: "Website Maintenance", 
    status: "active", 
    nextBilling: "2025-04-15", 
    amount: 299,
    upsell: {
      name: "Add SEO Optimization",
      price: 99,
      benefit: "Boost your search ranking by 30%"
    }
  },
  { 
    id: 2, 
    name: "Social Media Management", 
    status: "active", 
    nextBilling: "2025-04-10", 
    amount: 199,
    upsell: {
      name: "Upgrade to Premium Plan",
      price: 299,
      benefit: "Double your reach with advanced targeting"
    }
  },
  { 
    id: 3, 
    name: "Email Marketing", 
    status: "pending", 
    nextBilling: "2025-04-20", 
    amount: 99,
    upsell: {
      name: "Add AI Content Generation",
      price: 149,
      benefit: "Create engaging emails automatically"
    }
  }
];

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentMobileTabIndex, setCurrentMobileTabIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState("All Services");
  const [currentMobileSubTabIndex, setCurrentMobileSubTabIndex] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const roleTabs = ["Overview", "Services", "Invoices", "Reports", "Support"];
  
  // Sub-tabs for different main tabs
  const serviceSubTabs = ["All Services", "Active", "Pending", "Inactive"];
  const invoiceSubTabs = ["All Invoices", "Paid", "Pending", "Overdue"];
  const reportSubTabs = ["Website", "Social Media", "Email", "Analytics"];
  const supportSubTabs = ["Open Tickets", "Closed Tickets", "FAQs", "Contact"];
  
  // Get current sub-tabs based on active main tab
  const getCurrentSubTabs = () => {
    switch(activeTab) {
      case "Services": return serviceSubTabs;
      case "Invoices": return invoiceSubTabs;
      case "Reports": return reportSubTabs;
      case "Support": return supportSubTabs;
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
      case "Services": 
        defaultSubTab = serviceSubTabs[0];
        break;
      case "Invoices": 
        defaultSubTab = invoiceSubTabs[0];
        break;
      case "Reports": 
        defaultSubTab = reportSubTabs[0];
        break;
      case "Support": 
        defaultSubTab = supportSubTabs[0];
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 bg-opacity-40 text-green-300';
      case "pending":
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 bg-opacity-40 text-yellow-300';
      case "inactive":
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 bg-opacity-40 text-red-300';
      default:
        return theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 bg-opacity-40 text-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238] border border-[#2a3448]'} rounded-t-lg p-2 sm:p-3 px-3 sm:px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-teal-400" />
            <h1 className="text-lg sm:text-xl font-medium">
              Client Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
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
                  <User className="h-4 w-4 mr-1.5 text-teal-400" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user?.first_name || 'Client'}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 py-2 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-20`}
                  >
                    <div className={`px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Signed in as <span className="font-medium">{user?.email || 'client@example.com'}</span>
                    </div>
                    <div className="border-t my-1"></div>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/client/profile')}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </div>
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#1e2a45]'}`}
                      onClick={() => navigate('/dashboard/client/help')}
                    >
                      <div className="flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help & Support
                      </div>
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
                    {user?.first_name || 'Client'}
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
                  navigate('/dashboard/client/profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">Profile Settings</span>
              </button>
              
              <button 
                className={`flex items-center px-3 py-2 rounded-md ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'}`}
                onClick={() => {
                  navigate('/dashboard/client/help');
                  setIsMobileMenuOpen(false);
                }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Help & Support</span>
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
          
          {/* Main Dashboard Content */}
          <div>
            {activeTab === "Overview" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Welcome back, {user?.first_name || 'Client'}
                </h3>
                
                {/* Service Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Active Services
                      </h3>
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {services.filter(s => s.status === 'active').length}
                      </p>
                      <p className={`text-xs font-medium mt-1 text-green-500`}>
                        All services running normally
                      </p>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Next Payment
                      </h3>
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {formatCurrency(services.reduce((sum, s) => sum + s.amount, 0))}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Due on {formatDate(services[0].nextBilling)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Support Tickets
                      </h3>
                    </div>
                    <div className="mt-2">
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        0
                      </p>
                      <p className={`text-xs font-medium mt-1 text-green-500`}>
                        No pending tickets
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mb-6">
                  <h3 className={`text-base font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Recent Activity
                  </h3>
                  <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-lg p-4`}>
                    <div className={`flex flex-col space-y-3 ${theme === 'light' ? 'divide-y divide-gray-200' : 'divide-y divide-[#2a3448]'}`}>
                      <div className="flex items-start pt-3 first:pt-0">
                        <div className={`${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900 bg-opacity-30'} p-2 rounded-full mr-3`}>
                          <CreditCard className={`h-4 w-4 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            Payment processed
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Your payment of {formatCurrency(497)} was processed successfully.
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                            2 days ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start pt-3">
                        <div className={`${theme === 'light' ? 'bg-green-100' : 'bg-green-900 bg-opacity-30'} p-2 rounded-full mr-3`}>
                          <BarChart className={`h-4 w-4 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            Website analytics updated
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Your monthly analytics report is ready to view.
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                            5 days ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start pt-3">
                        <div className={`${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900 bg-opacity-30'} p-2 rounded-full mr-3`}>
                          <FileText className={`h-4 w-4 ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            New invoice generated
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Invoice #INV-2025-004 has been generated for your services.
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                            1 week ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "Services" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Your Services
                  </h3>
                </div>
                
                {/* Services List - Filtered by sub-tab */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {services
                    .filter(service => 
                      activeSubTab === "All Services" ? true :
                      activeSubTab === "Active" ? service.status === "active" :
                      activeSubTab === "Pending" ? service.status === "pending" :
                      activeSubTab === "Inactive" ? service.status === "inactive" : true
                    )
                    .map(service => (
                    <div 
                      key={service.id} 
                      className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-lg p-5`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {service.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(service.status)}`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </div>
                      <div className={`mb-4 pb-4 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-[#2a3448]'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Next billing:</span>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatDate(service.nextBilling)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Amount:</span>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatCurrency(service.amount)}/month</span>
                        </div>
                      </div>
                      
                      {/* Upsell Section */}
                      <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900 bg-opacity-20 border border-blue-800'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                              {service.upsell.name} - {formatCurrency(service.upsell.price)}/month
                            </h5>
                            <p className={`text-xs ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                              {service.upsell.benefit}
                            </p>
                          </div>
                          <button className="flex items-center text-xs font-medium bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded">
                            Add
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "Invoices" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Invoices
                </h3>
                {/* Placeholder for invoices section with sub-tab filtering */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Your {activeSubTab.toLowerCase()} will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Reports" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Reports
                </h3>
                {/* Placeholder for reports section with sub-tab filtering */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Your {activeSubTab.toLowerCase()} reports will be displayed here.
                </p>
              </div>
            )}
            
            {activeTab === "Support" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Support Center
                </h3>
                {/* Placeholder for support section with sub-tab filtering */}
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {activeSubTab === "FAQs" ? "Frequently asked questions" : 
                   activeSubTab === "Contact" ? "Contact information" : 
                   `Your ${activeSubTab.toLowerCase()}`} will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
