import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DynamicContentSection from '../components/DynamicContentSection';

// Import hero sections
import HomeHero from '../components/hero/HomeHero';
import ServicesHero from '../components/hero/ServicesHero';
import AIIntegrationHero from '../components/hero/AIIntegrationHero';
import OurWorkHero from '../components/hero/OurWorkHero';
import PackagesHero from '../components/hero/PackagesHero';
import ContactHero from '../components/hero/ContactHero';

// Define sections for the horizontal scroll
const HOME_SECTIONS = [
  { id: 'Home', label: 'Home' },
  { id: 'Services', label: 'Services' },
  { id: 'AiIntegration', label: 'AI Integration' },
  { id: 'OurWork', label: 'Our Work' },
  { id: 'Packages', label: 'Packages' },
  { id: 'Contact', label: 'Contact' }
];

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a section is specified in the URL on initial load
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    if (hash && HOME_SECTIONS.some(section => section.id === hash)) {
      setActiveSection(hash);
    }
  }, [location]);

  // Update URL hash when active section changes
  useEffect(() => {
    navigate(`/#${activeSection}`, { replace: true });
  }, [activeSection, navigate]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle navigation
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
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

      {/* Main Content with Horizontal Scroll */}
      <div className="pt-16 relative w-full h-[calc(100vh-64px)]">
        <DynamicContentSection
          sections={HOME_SECTIONS}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        >
          {/* Home section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12">
            <div className="container mx-auto">
              <HomeHero theme={theme} />
            </div>
          </div>

          {/* Services section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
            <div className="container mx-auto py-12">
              <ServicesHero theme={theme} />
            </div>
          </div>

          {/* AI Integration section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
            <div className="container mx-auto py-12">
              <AIIntegrationHero theme={theme} />
            </div>
          </div>

          {/* Our Work section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
            <div className="container mx-auto py-12">
              <OurWorkHero theme={theme} />
            </div>
          </div>

          {/* Packages section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
            <div className="container mx-auto py-12">
              <PackagesHero theme={theme} />
            </div>
          </div>

          {/* Contact section */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
            <div className="container mx-auto py-12">
              <ContactHero theme={theme} />
            </div>
          </div>
        </DynamicContentSection>
      </div>
    </div>
  );
};

export default Home;
