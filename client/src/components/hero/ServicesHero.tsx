import React from 'react';
import { Laptop, Megaphone, Cloud, BrainCircuit } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  theme?: 'light' | 'dark';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-lg p-6 shadow-md border hover:shadow-lg transition-all ${
      isDark 
        ? 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10' 
        : 'bg-white border-cyberhand-dark/10 hover:bg-gray-50'
    }`}>
      <div className="bg-cyberhand-green bg-opacity-20 rounded-full p-4 inline-flex mb-4">
        <Icon className="h-8 w-8 text-cyberhand-green" />
      </div>
      <h3 className={`text-xl font-montserrat font-semibold mb-2 ${isDark ? 'text-white' : 'text-cyberhand-dark'}`}>
        {title}
      </h3>
      <p className={isDark ? 'text-white/70' : 'text-cyberhand-dark/70'}>
        {description}
      </p>
    </div>
  );
};

interface ServicesHeroProps {
  theme?: 'light' | 'dark';
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  const services = [
    {
      icon: Laptop,
      title: "Web Development",
      description: "Custom websites from one-page landing sites to e-commerce platforms, starting at $399."
    },
    {
      icon: Megaphone,
      title: "Marketing Services",
      description: "Boost your online presence with Google Ads, SEO, and social media management, starting at $49/month."
    },
    {
      icon: Cloud,
      title: "Cloud Hosting",
      description: "Reliable, scalable hosting solutions starting at $24.99/month."
    },
    {
      icon: BrainCircuit,
      title: "AI Integration",
      description: "Enhance your business with tailored AI solutions, starting at $499 setup."
    }
  ];

  return (
    <section className="w-full animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-montserrat mb-4 ${
          isDark ? 'text-white' : 'text-cyberhand-dark'
        }`}>
          Our Services
        </h2>
        <p className={`font-roboto max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-cyberhand-dark/70'
        }`}>
          Comprehensive digital solutions to power your business growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesHero;
