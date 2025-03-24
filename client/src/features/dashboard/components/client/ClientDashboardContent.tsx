import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  User, 
  CreditCard, 
  FileText, 
  Sun, 
  Moon,
  X, 
  ChevronDown,
  LayoutDashboard,
  ArrowUpRight,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { User as UserType } from '../../../../types/user';
import { ClientService } from '../../../../types/service';
import useClickOutside from '../../../../hooks/useClickOutside';
import useDashboardNavigation from '../../../../hooks/useDashboardNavigation';
import useApiError from '../../../../hooks/useApiError';
import ErrorDisplay from '../../../../components/ui/ErrorDisplay';
import { useTheme } from '../../../../context/ThemeContext';
import Icon from '../../../../components/ui/Icon';
import Card from '../../../../components/ui/Card';
import MetricCard from '../../../../components/ui/MetricCard';
import serviceAPI from '../../../../api/services/serviceAPI';

// Extended ClientService type with UI-specific properties
interface ExtendedClientService extends ClientService {
  upsell?: {
    name: string;
    price: number;
    benefit: string;
  };
}

interface ClientDashboardContentProps {
  user: UserType;
}

// Mock services for client (for fallback)
const mockServices: ExtendedClientService[] = [
  { 
    id: 1, 
    name: "Website Maintenance", 
    status: "active" as const, 
    nextBillingDate: "2025-04-15", 
    startDate: "2024-10-15",
    price: 299,
    category: "maintenance",
    billingPeriod: "monthly",
    isRecurring: true,
    description: "Monthly maintenance of your website",
    upsell: {
      name: "Add SEO Optimization",
      price: 99,
      benefit: "Boost your search ranking by 30%"
    }
  },
  { 
    id: 2, 
    name: "Social Media Management", 
    status: "active" as const, 
    nextBillingDate: "2025-04-10", 
    startDate: "2024-11-10",
    price: 199,
    category: "marketing",
    billingPeriod: "monthly",
    isRecurring: true,
    description: "Managing your social media accounts",
    upsell: {
      name: "Upgrade to Premium Plan",
      price: 299,
      benefit: "Double your reach with advanced targeting"
    }
  },
  { 
    id: 3, 
    name: "Email Marketing", 
    status: "pending" as const, 
    nextBillingDate: "2025-04-20", 
    startDate: "2024-12-20",
    price: 99,
    category: "marketing",
    billingPeriod: "monthly",
    isRecurring: true,
    description: "Regular email campaigns",
    upsell: {
      name: "Add AI Content Generation",
      price: 149,
      benefit: "Create engaging emails automatically"
    }
  }
];

const ClientDashboardContent: React.FC<ClientDashboardContentProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [clientServices, setClientServices] = useState<ExtendedClientService[]>(mockServices);
  const { error, isLoading, handleApiCall, clearError } = useApiError();
  
  const roleTabs = ["Overview", "Services", "Invoices", "Reports", "Support"];
  
  // Define custom sub-tabs
  const customSubTabs: Record<string, string[]> = {
    "Services": ["All Services", "Active", "Pending", "Inactive"],
    "Invoices": ["All Invoices", "Paid", "Pending", "Overdue"],
    "Reports": ["Website", "Social Media", "Email", "Analytics"],
    "Support": ["Open Tickets", "Closed Tickets", "FAQs", "Contact"]
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
  
  // Fetch client services when component mounts
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchClientServices = async () => {
      try {
        const response = await handleApiCall(
          serviceAPI.getClientServices(user.id.toString()),
          { context: 'Fetching client services' }
        );
        
        if (response?.data) {
          // Transform API response to include upsell property
          const enhancedServices: ExtendedClientService[] = response.data.map(service => ({
            ...service,
            // Add sample upsell recommendations based on service type
            upsell: getUpsellRecommendation(service.category)
          }));
          
          setClientServices(enhancedServices);
        } else {
          // Fallback to mock data if API fails
          setClientServices(mockServices);
        }
      } catch (err) {
        // Error already handled by useApiError hook
        console.error('Error fetching client services:', err);
        // Fallback to mock data
        setClientServices(mockServices);
      }
    };
    
    fetchClientServices();
  }, [user?.id, handleApiCall]);
  
  // Helper function to generate upsell recommendations based on service category
  const getUpsellRecommendation = (category?: string) => {
    switch(category) {
      case 'maintenance':
        return {
          name: 'Add SEO Optimization',
          price: 99,
          benefit: 'Boost your search ranking by 30%'
        };
      case 'marketing':
        return {
          name: 'Upgrade to Premium Plan',
          price: 299,
          benefit: 'Double your reach with advanced targeting'
        };
      default:
        return {
          name: 'Add Premium Support',
          price: 149,
          benefit: 'Priority support and faster response times'
        };
    }
  };
  
  // Close the user menu when clicking outside
  useClickOutside(userMenuRef, () => {
    setIsUserMenuOpen(false);
  });
  
  // Set initial theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    // We are now using ThemeContext, so we don't need to set document classes here
  }, []);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
                    {user?.firstName || user?.first_name || 'Client'}
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
        
        {/* Sub Navigation - Show on mobile and desktop when there are sub-tabs */}
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
              <Loader className="h-8 w-8 animate-spin text-teal-500" />
              <span className="ml-3">Loading data...</span>
            </div>
          ) : error ? (
            <ErrorDisplay 
              error={error} 
              onDismiss={clearError} 
              onRetry={() => {
                // Implement retry logic for the specific tab
                clearError();
                // Re-fetch data based on active tab
              }}
            />
          ) : (
            <>
              {/* Tab Content */}
              {activeTab === "Overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                      title="Active Services" 
                      value={clientServices.filter(s => s.status === 'active').length.toString()}
                      icon={<BarChart className="h-5 w-5 text-blue-500" />}
                      trend={{
                        value: "+2",
                        label: "from last month",
                        direction: "up"
                      }}
                    />
                    
                    <MetricCard 
                      title="Monthly Spend" 
                      value={formatCurrency(clientServices.reduce((total, service) => 
                        service.status === 'active' ? total + service.price : total, 0)
                      )}
                      icon={<CreditCard className="h-5 w-5 text-green-500" />}
                      trend={{
                        value: "+15%",
                        label: "from last month",
                        direction: "up"
                      }}
                    />
                    
                    <MetricCard 
                      title="Pending Services" 
                      value={clientServices.filter(s => s.status === 'pending').length.toString()}
                      icon={<FileText className="h-5 w-5 text-yellow-500" />}
                    />
                    
                    <MetricCard 
                      title="Support Tickets" 
                      value="2"
                      icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
                      trend={{
                        value: "-1",
                        label: "from last month",
                        direction: "down"
                      }}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Recent Services
                    </h2>
                    <div className={`rounded-lg overflow-hidden ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#1e2a45] border border-[#2a3448]'}`}>
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-[#182032]'}>
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Next Billing
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                          {clientServices.slice(0, 3).map((service) => (
                            <tr key={service.id}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                      {service.name}
                                    </div>
                                    <div className="text-sm text-gray-500 sm:hidden">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                                        {service.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                                  {service.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                {formatDate(service.nextBillingDate)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                {formatCurrency(service.price)}/mo
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-3 bg-opacity-30 flex justify-center">
                        <Link 
                          to="#" 
                          onClick={() => setActiveTab("Services")}
                          className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} flex items-center`}
                        >
                          View all services
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Services Tab Content - Just a placeholder, would be expanded in a full implementation */}
              {activeTab === "Services" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Your Services
                  </h2>
                  {/* Service content based on activeSubTab */}
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Currently viewing: {activeSubTab || "All Services"}
                  </div>
                  
                  {/* Service listing would go here */}
                </div>
              )}
              
              {/* Other tab content as needed */}
              {activeTab === "Invoices" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Your Invoices
                  </h2>
                  {/* Invoice content based on activeSubTab */}
                </div>
              )}
              
              {activeTab === "Reports" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Your Reports
                  </h2>
                  {/* Reports content based on activeSubTab */}
                </div>
              )}
              
              {activeTab === "Support" && (
                <div>
                  <h2 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Support
                  </h2>
                  {/* Support content based on activeSubTab */}
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
                <div className="text-sm font-medium">{user?.firstName || 'Client'} {user?.lastName || ''}</div>
                <div className="text-xs text-gray-500">{user?.email || 'client@example.com'}</div>
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

export default ClientDashboardContent;
