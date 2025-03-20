import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
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
  
  // Listen for scroll to add background to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'Home', label: 'Home' },
    { id: 'Services', label: 'Services' },
    { id: 'AiIntegration', label: 'AI Integration' },
    { id: 'OurWork', label: 'Our Work' },
    { id: 'Packages', label: 'Packages' },
    { id: 'Contact', label: 'Contact' }
  ];

  const isDark = theme === 'dark';

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
        <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-cyberhand-dark'}`}>
          <span className="font-montserrat">CyberHand</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`hover:text-cyberhand-green transition-colors text-sm ${
                isDark ? 'text-white/90' : 'text-cyberhand-dark/90'
              }`}
              onClick={() => handleNavClick(link.id)}
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
            {navLinks.map(link => (
              <button
                key={link.id}
                className={`block w-full text-left py-3 transition-colors ${
                  isDark ? 'text-white/80 hover:text-white' : 'text-cyberhand-dark/80 hover:text-cyberhand-dark'
                }`}
                onClick={() => handleNavClick(link.id)}
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
