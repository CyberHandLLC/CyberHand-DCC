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
  Menu, 
  X, 
  ChevronDown,
  MoreVertical
} from 'lucide-react';

// Mock data for the dashboard
const clients = [
  { id: 1, name: "Alicia Koch", email: "alicia@example.com", role: "Admin" },
  { id: 2, name: "John Smith", email: "john@example.com", role: "Client" },
  { id: 3, name: "Sarah Lee", email: "sarah@example.com", role: "Client" }
];

const recentSales = [
  { id: 1, name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999 },
  { id: 2, name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39 },
  { id: 3, name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 299 },
  { id: 4, name: "William Kim", email: "will@email.com", amount: 99 },
  { id: 5, name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39 }
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
    if (user.role === 'Admin' || user.role === 'Staff') {
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

  const metrics = getDashboardMetrics();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#0a101f] dark:text-white flex flex-col">
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className="bg-[#162238] rounded-t-lg p-2 sm:p-3 px-3 sm:px-6 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-medium text-white">Dashboard</h1>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className="p-1.5 bg-[#182032] rounded-md md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {["Overview", "Customers", "Products", "Settings"].map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-sm ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-300"
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
                className="bg-[#1e293b] focus:outline-none block w-36 md:w-48 pl-10 pr-3 py-1.5 border border-[#1e293b] rounded-md text-sm text-gray-100 placeholder-gray-400"
                placeholder="Search..."
              />
            </div>
            
            <button className="p-1.5 bg-[#182032] rounded-md">
              <User className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#182032] border-l border-r border-[#30384a] px-4 py-2">
            <div className="space-y-2">
              {["Overview", "Customers", "Products", "Settings"].map(tab => (
                <button
                  key={tab}
                  className={`block w-full text-left px-2 py-2 rounded-md text-sm ${
                    activeTab === tab
                      ? "bg-[#1e293b] text-white"
                      : "text-gray-400 hover:text-gray-300"
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
                  className="bg-[#1e293b] focus:outline-none block w-full pl-10 pr-3 py-2 border border-[#1e293b] rounded-md text-sm text-gray-100 placeholder-gray-400"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Client Selector and Tabs */}
        <div className="bg-[#121a2d] p-2 sm:p-3 px-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#30384a]">
          <div className="relative mb-3 sm:mb-0" ref={clientDropdownRef}>
            <button 
              className="flex items-center space-x-2 px-2 py-1 rounded-md"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
            >
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">{selectedClient.name.charAt(0)}</span>
              </div>
              <span className="text-gray-100 text-sm">{selectedClient.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Dropdown menu */}
            {isClientDropdownOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-[#182032] ring-1 ring-[#30384a] z-50">
                <div className="py-1">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-[#1e293b]"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsClientDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mr-2">
                          <span className="text-white text-xs">{client.name.charAt(0)}</span>
                        </div>
                        <span>{client.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sub Tabs - Desktop */}
          <div className="hidden sm:flex space-x-4">
            {["Overview", "Analytics", "Reports", "Notifications"].map(tab => (
              <button
                key={tab}
                className={`px-2 py-2 text-sm font-medium ${
                  activeSubTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
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
              className="flex items-center justify-between w-full px-2 py-2 bg-[#182032] rounded-md"
              onClick={() => setIsMobileSubMenuOpen(!isMobileSubMenuOpen)}
            >
              <span className="text-white text-sm">{activeSubTab}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {isMobileSubMenuOpen && (
              <div className="mt-1 rounded-md shadow-lg bg-[#182032] ring-1 ring-[#30384a] z-50">
                <div className="py-1">
                  {["Overview", "Analytics", "Reports", "Notifications"].map(tab => (
                    <button
                      key={tab}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        activeSubTab === tab
                          ? "bg-[#1e293b] text-white"
                          : "text-gray-300 hover:bg-[#1e293b]"
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
        <div className="bg-[#111827] rounded-b-lg p-3 sm:p-4 md:p-6">
          {/* Metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {/* Total Revenue */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400">Total Revenue</h3>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{formatCurrency(metrics.totalRevenue.value)}</div>
              <div className="mt-1 text-xs text-green-500">
                {metrics.totalRevenue.change} from last month
              </div>
            </div>
            
            {/* Subscriptions */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400">Subscriptions</h3>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">+{metrics.subscriptions.value}</div>
              <div className="mt-1 text-xs text-green-500">
                {metrics.subscriptions.change} from last month
              </div>
            </div>
            
            {/* Sales */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400">Sales</h3>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">+{metrics.sales.value}</div>
              <div className="mt-1 text-xs text-green-500">
                {metrics.sales.change} from last month
              </div>
            </div>
            
            {/* Active Now */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400">Active Now</h3>
                <Activity className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">+{metrics.activeNow.value}</div>
              <div className="mt-1 text-xs text-green-500">
                {metrics.activeNow.change} since last hour
              </div>
            </div>
          </div>
          
          {/* Charts and recent sales section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Chart */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-4 md:mb-8 text-white">Overview</h3>
              <div className="h-48 sm:h-56 md:h-64 flex items-end space-x-1 sm:space-x-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
                  // Generate the heights for the chart bars to match the image
                  const heights = [45, 15, 15, 60, 50, 60, 40, 25, 25, 20, 15, 30];
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-400 dark:bg-green-500 rounded-t" 
                        style={{ height: `${heights[i]}%` }}
                      ></div>
                      <div className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-gray-500">{month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recent sales */}
            <div className="rounded-lg border border-[#30384a] bg-[#1a2236] p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 text-white">Recent Sales</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                You made 265 sales this month.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {recentSales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2a3349] flex items-center justify-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-xs sm:text-sm text-white">{sale.name}</div>
                        <div className="text-xs text-gray-400">{sale.email}</div>
                      </div>
                    </div>
                    <div className="font-medium text-xs sm:text-sm text-white">
                      +{formatCurrency(sale.amount).replace('$', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
