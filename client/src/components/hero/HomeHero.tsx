import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HomeHeroProps {
  theme?: 'light' | 'dark';
}

const HomeHero: React.FC<HomeHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full flex items-center">
      {/* Content container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Main text content */}
        <div className="px-4 md:px-8 lg:px-12 flex flex-col space-y-6 animate-fade-in">
          <div className="flex">
            <a 
              href="#" 
              className={`inline-flex items-center justify-center rounded-full border px-6 py-2 text-sm hover:bg-white/20 transition-colors ${
                isDark 
                  ? 'border-white/20 bg-white/10 text-white' 
                  : 'border-cyberhand-dark/20 bg-cyberhand-dark/10 text-cyberhand-dark'
              }`}
            >
              SCHEDULE A CALL
            </a>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-cyberhand-dark'}`}>
            Your Digital<br />
            Growth<br />
            Partner
          </h1>
          
          <p className={`text-lg md:text-xl font-light max-w-md mt-4 ${isDark ? 'text-white/90' : 'text-cyberhand-dark/90'}`}>
            We deliver scalable web development, marketing, and AI integration solutions for businesses of all sizes.
          </p>
          
          <div className="pt-4">
            <button 
              className={`bg-cyberhand-green hover:bg-opacity-90 text-white rounded-full px-8 py-6 text-base flex items-center gap-2 h-auto`}
              onClick={() => {}}
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Right side - Floating cards */}
        <div className="hidden lg:flex flex-col gap-6 items-end px-12">
          {/* First card - Stats */}
          <div className={`rounded-xl p-6 w-full max-w-md border shadow-xl transform hover:-translate-y-1 transition-transform duration-300 ${
            isDark 
              ? 'bg-cyberhand-blue/50 backdrop-blur-md border-white/10' 
              : 'bg-white border-cyberhand-dark/10'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`rounded-lg p-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <div className="w-32 h-24 rounded flex items-center justify-center">
                  <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 50L30 30L50 40L70 10" stroke={isDark ? "#10B981" : "#10B981"} strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="10" cy="50" r="3" fill={isDark ? "#10B981" : "#10B981"}/>
                    <circle cx="30" cy="30" r="3" fill={isDark ? "#10B981" : "#10B981"}/>
                    <circle cx="50" cy="40" r="3" fill={isDark ? "#10B981" : "#10B981"}/>
                    <circle cx="70" cy="10" r="3" fill={isDark ? "#10B981" : "#10B981"}/>
                  </svg>
                </div>
              </div>
              <div className={isDark ? 'text-white' : 'text-cyberhand-dark'}>
                <h3 className="text-lg font-semibold">Drive More Traffic</h3>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-cyberhand-dark/70'}`}>And Product Sales</p>
              </div>
            </div>
          </div>
          
          {/* Second card - Blog */}
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="bg-cyberhand-green h-2 w-2 rounded-full mr-2"></span>
                  <span className="text-sm font-medium text-gray-600">Blog</span>
                </div>
                <div className="w-full h-36 rounded-lg mb-3 bg-gray-200 animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-800">How AI integration can transform your business: A comprehensive guide</h3>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="bg-cyberhand-green text-white px-4 py-1 rounded-full text-sm font-medium">
                Read
              </button>
              <div className="text-sm text-gray-500">01 / 05</div>
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span className="mr-2">AI Integration</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
