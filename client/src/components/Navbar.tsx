import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  theme = 'dark',
  onThemeToggle 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Listen for scroll to add background to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  // Define main navigation links - these will be visible in the nav bar
  const mainNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services', hasDropdown: true },
    { path: '/blog', label: 'Blog' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' }
  ];

  // Define services dropdown links
  const servicesLinks = [
    { path: '/services', label: 'All Services' },
    { path: '/ai-integration', label: 'AI Integration' },
    { path: '/cloud-hosting', label: 'Cloud Hosting' },
    { path: '/marketing', label: 'Marketing' }
  ];

  // Define links that require authentication
  const authLinks = [
    { path: '/dashboard', label: 'Dashboard', requiresAuth: true }
  ];

  const isDark = theme === 'dark';
  const isHomePage = location.pathname === '/';

  // Check if the current path is in the services dropdown
  const isInServicesDropdown = servicesLinks.some(link => location.pathname === link.path);

  // If we're on the home page, handle section navigation
  const getActivePath = (path: string) => {
    if (isHomePage && path === '/') {
      return path;
    }
    return location.pathname === path;
  };

  const toggleServicesDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${
        scrolled 
          ? isDark ? 'bg-cyberhand-dark/90 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-md shadow-md'  
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div 
          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-cyberhand-dark'} cursor-pointer`}
          onClick={() => handleNavClick('/')}
        >
          <span className="font-montserrat">CyberHand</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainNavLinks.map(link => (
            link.hasDropdown ? (
              <div key={link.path} className="relative" ref={dropdownRef}>
                <button
                  className={`hover:text-cyberhand-green transition-colors text-sm flex items-center gap-1 ${
                    getActivePath(link.path) || isInServicesDropdown
                      ? isDark ? 'text-cyberhand-green' : 'text-cyberhand-green'
                      : isDark ? 'text-white/90' : 'text-cyberhand-dark/90'
                  }`}
                  onClick={toggleServicesDropdown}
                >
                  {link.label.toUpperCase()}
                  {servicesDropdownOpen ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>
                
                {/* Services Dropdown */}
                {servicesDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg ${
                    isDark ? 'bg-cyberhand-dark border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="py-1">
                      {servicesLinks.map(serviceLink => (
                        <button
                          key={serviceLink.path}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            getActivePath(serviceLink.path) 
                              ? 'text-cyberhand-green'
                              : isDark ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'
                          }`}
                          onClick={() => handleNavClick(serviceLink.path)}
                        >
                          {serviceLink.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={link.path}
                className={`hover:text-cyberhand-green transition-colors text-sm ${
                  getActivePath(link.path) 
                    ? isDark ? 'text-cyberhand-green' : 'text-cyberhand-green'
                    : isDark ? 'text-white/90' : 'text-cyberhand-dark/90'
                }`}
                onClick={() => handleNavClick(link.path)}
              >
                {link.label.toUpperCase()}
              </button>
            )
          ))}
          
          {/* Authentication links */}
          {authLinks.map(link => (
            <button
              key={link.path}
              className={`hover:text-cyberhand-green transition-colors text-sm ${
                getActivePath(link.path) 
                  ? isDark ? 'text-cyberhand-green' : 'text-cyberhand-green'
                  : isDark ? 'text-white/90' : 'text-cyberhand-dark/90'
              }`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* Controls: Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
          {onThemeToggle && (
            <button 
              onClick={onThemeToggle}
              className={`p-2 rounded-full ${
                isDark 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-cyberhand-dark/70 hover:text-cyberhand-dark hover:bg-cyberhand-dark/10'
              }`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${
              isDark 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-cyberhand-dark/70 hover:text-cyberhand-dark hover:bg-cyberhand-dark/10'
            }`}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 shadow-md z-50 border-t ${
          isDark 
            ? 'bg-cyberhand-blue/90 backdrop-blur-md border-white/10' 
            : 'bg-white/90 backdrop-blur-md border-cyberhand-dark/10'
        }`}>
          <div className="container mx-auto px-4 py-2 space-y-1">
            {mainNavLinks.map(link => 
              link.hasDropdown ? (
                <div key={link.path}>
                  <button
                    className={`flex w-full justify-between items-center text-left py-3 transition-colors ${
                      getActivePath(link.path) || isInServicesDropdown
                        ? 'text-cyberhand-green'
                        : isDark ? 'text-white/80 hover:text-white' : 'text-cyberhand-dark/80 hover:text-cyberhand-dark'
                    }`}
                    onClick={toggleServicesDropdown}
                  >
                    <span>{link.label}</span>
                    {servicesDropdownOpen ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                  
                  {/* Mobile Services Dropdown */}
                  {servicesDropdownOpen && (
                    <div className="pl-4 space-y-1 mt-1 mb-2">
                      {servicesLinks.map(serviceLink => (
                        serviceLink.path !== '/services' && (
                          <button
                            key={serviceLink.path}
                            className={`block w-full text-left py-2 text-sm ${
                              getActivePath(serviceLink.path) 
                                ? 'text-cyberhand-green'
                                : isDark ? 'text-white/70 hover:text-white' : 'text-cyberhand-dark/70 hover:text-cyberhand-dark'
                            }`}
                            onClick={() => handleNavClick(serviceLink.path)}
                          >
                            {serviceLink.label}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.path}
                  className={`block w-full text-left py-3 transition-colors ${
                    getActivePath(link.path)
                      ? 'text-cyberhand-green'
                      : isDark ? 'text-white/80 hover:text-white' : 'text-cyberhand-dark/80 hover:text-cyberhand-dark'
                  }`}
                  onClick={() => handleNavClick(link.path)}
                >
                  {link.label}
                </button>
              )
            )}
            
            {/* Authentication links for mobile */}
            {authLinks.map(link => (
              <button
                key={link.path}
                className={`block w-full text-left py-3 transition-colors ${
                  getActivePath(link.path)
                    ? 'text-cyberhand-green'
                    : isDark ? 'text-white/80 hover:text-white' : 'text-cyberhand-dark/80 hover:text-cyberhand-dark'
                }`}
                onClick={() => handleNavClick(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
