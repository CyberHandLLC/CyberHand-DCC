import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PortfolioItemProps {
  image: string;
  title: string;
  category: string;
  description: string;
  link: string;
  theme?: 'light' | 'dark';
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  image,
  title,
  category,
  description,
  link,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-lg overflow-hidden group transition-all duration-300 ${
      isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 
              'bg-white hover:shadow-lg border border-gray-200'
    }`}>
      <div className="relative overflow-hidden h-48">
        <div className="w-full h-full bg-gray-300 animate-pulse"></div>
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDark ? 'bg-black/50' : 'bg-white/50'
        }`}>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-cyberhand-green text-white"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            {category}
          </span>
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm mb-4 ${
          isDark ? 'text-white/70' : 'text-gray-600'
        }`}>
          {description}
        </p>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-cyberhand-green hover:underline"
        >
          Visit Site <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

interface OurWorkHeroProps {
  theme?: 'light' | 'dark';
}

const OurWorkHero: React.FC<OurWorkHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  const portfolioItems = [
    {
      image: '/portfolio-1.jpg',
      title: 'Tech Innovators Website',
      category: 'Web Development',
      description: 'A modern, responsive website for a tech startup with custom animations and API integration.',
      link: '#'
    },
    {
      image: '/portfolio-2.jpg',
      title: 'E-Commerce Platform',
      category: 'E-Commerce',
      description: 'A full-featured online store with inventory management, payment processing, and order tracking.',
      link: '#'
    },
    {
      image: '/portfolio-3.jpg',
      title: 'Healthcare App',
      category: 'Mobile App',
      description: 'A patient management application with appointment scheduling and secure messaging features.',
      link: '#'
    },
    {
      image: '/portfolio-4.jpg',
      title: 'Marketing Dashboard',
      category: 'Analytics',
      description: 'Real-time analytics dashboard for tracking marketing campaigns and conversions.',
      link: '#'
    }
  ];
  
  return (
    <section className="w-full animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-montserrat mb-4 ${
          isDark ? 'text-white' : 'text-cyberhand-dark'
        }`}>
          Our Work
        </h2>
        <p className={`max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-cyberhand-dark/70'
        }`}>
          Check out some of our recent projects and successful client collaborations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioItems.map((item, index) => (
          <PortfolioItem
            key={index}
            image={item.image}
            title={item.title}
            category={item.category}
            description={item.description}
            link={item.link}
            theme={theme}
          />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <button className={`px-6 py-3 rounded-full border ${
          isDark 
            ? 'border-white/20 text-white hover:bg-white/10' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
        }`}>
          View All Projects
        </button>
      </div>
    </section>
  );
};

export default OurWorkHero;
