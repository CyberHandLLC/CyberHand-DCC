import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-cyberhand-blue to-cyberhand-dark text-white' 
        : 'bg-gray-50 text-cyberhand-dark'
    }`}>
      {/* SEO Metadata */}
      <div className="hidden">
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CyberHand",
            "description": "Digital Growth Partner – Web, Marketing, AI Solutions",
            "url": "https://cyberhand.com",
            "logo": "https://cyberhand.com/logo.png",
            "sameAs": [
              "https://twitter.com/cyberhand",
              "https://www.linkedin.com/company/cyberhand",
              "https://www.facebook.com/cyberhand"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-123-456-7890",
              "contactType": "customer service",
              "email": "info@cyberhand.com"
            }
          })}
        </script>
      </div>

      {/* Fixed Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      {/* Main Content with Horizontal Scroll */}
      <main className="pt-16 relative w-full h-[calc(100vh-64px)]">
        {children || <Outlet />}
      </main>

      {/* Footer - displayed at specific locations or states
      {location.pathname.includes('/contact') && (
        <Footer theme={theme} />
      )} */}
    </div>
  );
};

export default MainLayout;
