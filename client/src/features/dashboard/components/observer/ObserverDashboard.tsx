import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Sun, 
  Moon,
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  Settings
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

interface ObserverDashboardProps {
  user: any;
}

// Observer dashboard is minimal, focusing only on service purchases
const ObserverDashboard: React.FC<ObserverDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Services");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
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

  // Observer-specific tabs - simple structure
  const roleTabs = ["Services", "Profile"];

  // Mock available services for Observer
  const availableServices = [
    {
      id: 1,
      name: "Basic Website Package",
      description: "A simple website with up to 5 pages and basic SEO optimization.",
      price: 999,
      features: ["5 Pages", "Mobile Responsive", "Basic SEO", "Contact Form"]
    },
    {
      id: 2,
      name: "Business Website Package",
      description: "A professional website with up to 10 pages, advanced SEO, and content management.",
      price: 1999,
      features: ["10 Pages", "CMS Integration", "Advanced SEO", "Blog Setup", "Analytics"]
    },
    {
      id: 3,
      name: "E-Commerce Package",
      description: "A complete online store with product management, payment processing, and customer accounts.",
      price: 3999,
      features: ["Product Management", "Payment Gateway", "Customer Accounts", "Order Tracking", "Inventory Management"]
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'dark:bg-[#0a101f] dark:text-white'} flex flex-col`}>
      {/* Dashboard Container */}
      <div className="w-full max-w-[1200px] mx-auto py-4 px-3 sm:py-6 sm:px-4 md:my-8">
        {/* Dashboard Header */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#162238]'} rounded-t-lg p-2 sm:p-3 px-3 sm:px-6 flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-teal-400" />
            <h1 className="text-lg sm:text-xl font-medium text-white">
              Observer Dashboard
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
                    {user?.first_name || 'Observer'}
                  </span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 py-2 ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-md shadow-lg z-20`}
                  >
                    <div className={`px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Signed in as <span className="font-medium">{user?.email || 'observer@example.com'}</span>
                    </div>
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
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`${theme === 'light' ? 'bg-white border-t border-x border-gray-200' : 'bg-[#162238] border-t border-x border-[#2a3448]'} p-3 md:hidden`}>
            <div className="grid grid-cols-2 gap-2">
              {roleTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab 
                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-[#182032] text-white'}`
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#182032]'}`
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-3 border-t pt-3 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5 text-teal-400" />
                <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {user?.first_name || 'Observer'}
                </span>
              </div>
              <div className="flex items-center">
                <button 
                  className={`p-1.5 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#182032] hover:bg-[#1e2a45]'} rounded-md mr-2`}
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? 
                    <Moon className="h-4 w-4 text-gray-700" /> : 
                    <Sun className="h-4 w-4 text-gray-300" />
                  }
                </button>
                <button 
                  className={`${theme === 'light' ? 'text-red-600 bg-gray-100 hover:bg-gray-200' : 'text-red-400 bg-[#182032] hover:bg-[#1e2a45]'} p-1.5 rounded-md`}
                  onClick={handleLogout}
                >
                  <span className="text-sm">Logout</span>
                </button>
              </div>
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
            <span className="mx-2">/</span>
            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{activeTab}</span>
          </div>
          
          {/* Main Dashboard Content */}
          <div>
            {activeTab === "Services" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Available Services
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {availableServices.map(service => (
                    <div 
                      key={service.id} 
                      className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-lg p-5`}
                    >
                      <div className="flex items-center mb-3">
                        <ShoppingCart className="h-5 w-5 text-teal-400 mr-2" />
                        <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {service.name}
                        </h4>
                      </div>
                      <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {service.description}
                      </p>
                      <div className="mb-4">
                        <h5 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                          Features:
                        </h5>
                        <ul className={`text-sm space-y-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 bg-teal-400 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          ${service.price}
                        </p>
                        <button 
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-md"
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "Profile" && (
              <div>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Profile Settings
                </h3>
                <div className={`${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-[#182032] border border-[#2a3448]'} rounded-lg p-5`}>
                  <div className="flex items-center mb-5">
                    <div className={`h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center ${theme === 'light' ? 'text-indigo-500' : 'text-indigo-400'}`}>
                      {user?.first_name?.charAt(0) || 'O'}
                    </div>
                    <div className="ml-3">
                      <p className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                        {user?.first_name || 'Observer'} {user?.last_name || 'User'}
                      </p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {user?.email || 'observer@example.com'}
                      </p>
                    </div>
                    <button 
                      className={`ml-auto p-2 ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-[#1e2a45] hover:bg-[#243556]'} rounded-md`}
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                  <div className={`space-y-4 ${theme === 'light' ? 'border-t border-gray-200 pt-4' : 'border-t border-[#2a3448] pt-4'}`}>
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            First Name
                          </label>
                          <input 
                            type="text" 
                            value={user?.first_name || 'Observer'} 
                            className={`w-full p-2 rounded-md ${theme === 'light' ? 'border border-gray-300 bg-white' : 'border border-[#2a3448] bg-[#12192e]'}`}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Last Name
                          </label>
                          <input 
                            type="text" 
                            value={user?.last_name || 'User'} 
                            className={`w-full p-2 rounded-md ${theme === 'light' ? 'border border-gray-300 bg-white' : 'border border-[#2a3448] bg-[#12192e]'}`}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Email
                          </label>
                          <input 
                            type="email" 
                            value={user?.email || 'observer@example.com'} 
                            className={`w-full p-2 rounded-md ${theme === 'light' ? 'border border-gray-300 bg-white' : 'border border-[#2a3448] bg-[#12192e]'}`}
                            readOnly
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Role
                          </label>
                          <input 
                            type="text" 
                            value="Observer" 
                            className={`w-full p-2 rounded-md ${theme === 'light' ? 'border border-gray-300 bg-white' : 'border border-[#2a3448] bg-[#12192e]'}`}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button 
                        className="w-full md:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObserverDashboard;
