import React from 'react';
import { Bot, Zap, LineChart, MessageSquare } from 'lucide-react';

interface AIServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  theme?: 'light' | 'dark';
}

const AIServiceCard: React.FC<AIServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 ${
      isDark ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10' : 
      'bg-white shadow-lg border border-gray-200'
    }`}>
      <div className="p-6">
        <div className="mb-4 rounded-full bg-blue-500/20 p-3 w-12 h-12 flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h3>
        
        <p className={`${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      
      <div className={`px-6 py-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <a 
          href="#" 
          className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
        >
          Learn more →
        </a>
      </div>
    </div>
  );
};

interface AIIntegrationHeroProps {
  theme?: 'light' | 'dark';
}

const AIIntegrationHero: React.FC<AIIntegrationHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  const aiServices = [
    {
      icon: Bot,
      title: "AI Chatbots",
      description: "Implement conversational AI to handle customer inquiries, automate support, and improve user engagement on your website."
    },
    {
      icon: Zap,
      title: "Process Automation",
      description: "Automate repetitive tasks in your workflow with AI-powered solutions that save time and reduce human error."
    },
    {
      icon: LineChart,
      title: "Predictive Analytics",
      description: "Leverage machine learning models to analyze trends and predict future outcomes for data-driven decision making."
    },
    {
      icon: MessageSquare,
      title: "Content Generation",
      description: "Utilize AI to create high-quality content for your website, blogs, and marketing materials at scale."
    }
  ];
  
  return (
    <section className="w-full animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-montserrat mb-4 ${
          isDark ? 'text-white' : 'text-cyberhand-dark'
        }`}>
          AI Integration
        </h2>
        <p className={`max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-cyberhand-dark/70'
        }`}>
          Transform your business with cutting-edge artificial intelligence solutions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiServices.map((service, index) => (
          <AIServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            theme={theme}
          />
        ))}
      </div>
      
      <div className={`mt-12 p-6 rounded-lg ${
        isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Ready to add AI to your business?
            </h3>
            <p className={`${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Schedule a consultation with our AI specialists to discover the right solutions for your needs.
            </p>
          </div>
          <button className="px-6 py-3 bg-cyberhand-green text-white rounded-full hover:bg-opacity-90 transition-colors whitespace-nowrap">
            Book a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIIntegrationHero;
