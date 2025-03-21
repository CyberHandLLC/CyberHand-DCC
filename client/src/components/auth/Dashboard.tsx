import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { CalendarDays, Search, User, Download, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-cyberhand-dark dark:text-white">
      {/* Top navigation bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-cyberhand-blue px-4 py-3 flex justify-between items-center">
        {/* Client selector dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800"
            onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
          >
            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">{selectedClient.name.charAt(0)}</span>
            </div>
            <span>{selectedClient.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {isClientDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {clients.map(client => (
                  <button
                    key={client.id}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
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
        
        {/* Main navigation tabs */}
        <div className="hidden md:flex space-x-1">
          {["Overview", "Customers", "Products", "Settings"].map(tab => (
            <button
              key={tab}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Dashboard content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md p-1 px-3">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span className="text-sm">Jan 20, 2023 - Feb 09, 2023</span>
            </div>
            <button 
              className="flex items-center bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 rounded-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
        
        {/* Sub-navigation for Overview section */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex space-x-8">
            {["Overview", "Analytics", "Reports", "Notifications"].map(tab => (
              <button
                key={tab}
                className={`py-2 px-1 text-sm font-medium border-b-2 ${
                  activeSubTab === tab
                    ? "border-black dark:border-white text-black dark:text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue.value)}</div>
            <div className="mt-1 text-xs text-green-500">
              {metrics.totalRevenue.change} from last month
            </div>
          </div>
          
          {/* Subscriptions */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscriptions</h3>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">+{metrics.subscriptions.value}</div>
            <div className="mt-1 text-xs text-green-500">
              {metrics.subscriptions.change} from last month
            </div>
          </div>
          
          {/* Sales */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sales</h3>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">+{metrics.sales.value}</div>
            <div className="mt-1 text-xs text-green-500">
              {metrics.sales.change} from last month
            </div>
          </div>
          
          {/* Active Now */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Now</h3>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">+{metrics.activeNow.value}</div>
            <div className="mt-1 text-xs text-green-500">
              {metrics.activeNow.change} since last hour
            </div>
          </div>
        </div>
        
        {/* Charts and recent sales section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-medium mb-4">Overview</h3>
            <div className="h-64 flex items-end space-x-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
                // Generate random heights for the chart bars
                const heights = [65, 40, 35, 90, 85, 75, 70, 45, 50, 40, 35, 55];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-400 dark:bg-green-500 rounded-t" 
                      style={{ height: `${heights[i]}%` }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-500">{month}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Recent sales */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-medium mb-4">Recent Sales</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You made 265 sales this month.
            </p>
            <div className="space-y-4">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{sale.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{sale.email}</div>
                    </div>
                  </div>
                  <div className="font-medium">
                    +{formatCurrency(sale.amount).replace('$', '')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
